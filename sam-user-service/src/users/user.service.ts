import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    this.validateRoleRequirements(data);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    if (data.crp) {
      const existingCrp = await this.prisma.user.findUnique({
        where: { crp: data.crp },
      });

      if (existingCrp) {
        throw new ConflictException('CRP já cadastrado');
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const isActive = typeof data.active === 'boolean' ? data.active : false;
    const initialStatus = isActive ? 'AUTORIZADO' : 'PENDENTE';

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        crp: data.role === UserRole.PSICOLOGA_EDUCACIONAL ? data.crp : null,
        workUnit:
          data.role === UserRole.SUPERVISAO || data.role === UserRole.PSICOLOGA_EDUCACIONAL
            ? (data.workUnit ?? null)
            : null,
        allowedUnits: data.allowedUnits ?? [],
        passwordHash,
        active: isActive,
        status: initialStatus as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crp: true,
        workUnit: true,
        allowedUnits: true,
        active: true,
        status: true,
        mustChangePassword: true,
        resetRequested: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crp: true,
        workUnit: true,
        allowedUnits: true,
        active: true,
        status: true,
        mustChangePassword: true,
        resetRequested: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crp: true,
        workUnit: true,
        allowedUnits: true,
        active: true,
        status: true,
        mustChangePassword: true,
        resetRequested: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmailForAuth(email: string) {
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });
  }

  async toggleAuthorize(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isCurrentlyAuthorized = existingUser.active !== false && existingUser.status !== 'BLOQUEADO' && existingUser.status !== 'PENDENTE';
    const newActive = !isCurrentlyAuthorized;
    const newStatus = newActive ? 'AUTORIZADO' : 'BLOQUEADO';

    return this.prisma.user.update({
      where: { id },
      data: {
        active: newActive,
        status: newStatus as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        status: true,
      },
    });
  }

  async adminResetPassword(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (existingUser.status === 'BLOQUEADO') {
      throw new BadRequestException('Não é possível redefinir a senha de um usuário bloqueado.');
    }

    const tempPassword = this.generateRandomPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
        resetRequested: false,
      },
    });

    return {
      message: 'Senha resetada com sucesso',
      temporaryPassword: tempPassword,
    };
  }

  async requestReset(email: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.status === 'BLOQUEADO') {
        throw new ForbiddenException({
          code: 'USER_BLOCKED',
          message: 'O seu acesso ao sistema foi bloqueado. Por favor, entre em contato com o Administrador ou Psicólogo(a).',
        });
      }
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { resetRequested: true },
      });
    }
    return { message: 'Solicitação registrada com sucesso' };
  }

  async resetPasswordByUser(data: { email: string; newPassword: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (existingUser.status === 'BLOQUEADO') {
      throw new ForbiddenException({
        code: 'USER_BLOCKED',
        message: 'O seu acesso ao sistema foi bloqueado. Por favor, entre em contato com o Administrador ou Psicólogo(a).',
      });
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        mustChangePassword: false,
        resetRequested: false,
      },
    });

    return { message: 'Senha redefinida com sucesso' };
  }

  private generateRandomPassword(): string {
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const first = uppers[Math.floor(Math.random() * uppers.length)];
    let rest =
      lowers[Math.floor(Math.random() * lowers.length)] +
      numbers[Math.floor(Math.random() * numbers.length)];
    const all = uppers + lowers + numbers;
    for (let i = 0; i < 5; i++) {
      rest += all[Math.floor(Math.random() * all.length)];
    }
    const shuffled = rest
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    return first + shuffled;
  }

  async update(id: string, data: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const targetRole = (data.role ?? existingUser.role) as UserRole;
    this.validateRoleRequirements({
      role: targetRole,
      crp: data.crp ?? existingUser.crp ?? undefined,
      workUnit: (data.workUnit ?? existingUser.workUnit ?? undefined) as
        | CreateUserDto['workUnit']
        | undefined,
    });

    if (data.email && data.email !== existingUser.email) {
      const sameEmail = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (sameEmail) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    if (typeof data.crp !== 'undefined' && data.crp && data.crp !== existingUser.crp) {
      const sameCrp = await this.prisma.user.findUnique({
        where: { crp: data.crp },
      });
      if (sameCrp) {
        throw new ConflictException('CRP já cadastrado');
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      role?: UserRole;
      crp?: string | null;
      workUnit?: UpdateUserDto['workUnit'];
      allowedUnits?: any;
      passwordHash?: string;
    } = {};

    if (typeof data.name !== 'undefined') updateData.name = data.name;
    if (typeof data.email !== 'undefined') updateData.email = data.email;
    if (typeof data.role !== 'undefined') updateData.role = data.role;
    if (typeof data.password !== 'undefined') {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
    if (typeof data.allowedUnits !== 'undefined') {
      updateData.allowedUnits = (data.allowedUnits ?? []).filter(Boolean);
    }

    updateData.crp =
      targetRole === UserRole.PSICOLOGA_EDUCACIONAL
        ? (data.crp ?? existingUser.crp ?? null)
        : null;
    updateData.workUnit =
      targetRole === UserRole.SUPERVISAO || targetRole === UserRole.PSICOLOGA_EDUCACIONAL
        ? ((data.workUnit ?? existingUser.workUnit ?? null) as
            | CreateUserDto['workUnit']
            | null)
        : null;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crp: true,
        workUnit: true,
        allowedUnits: true,
        active: true,
        mustChangePassword: true,
        resetRequested: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }

  private validateRoleRequirements(
    data: Pick<CreateUserDto, 'role' | 'crp' | 'workUnit'>,
  ) {
    if (data.role === UserRole.PSICOLOGA_EDUCACIONAL && !data.crp) {
      throw new BadRequestException('CRP é obrigatório para psicóloga educacional');
    }

    if (data.role === UserRole.SUPERVISAO && !data.workUnit) {
      throw new BadRequestException(
        'Unidade de trabalho é obrigatória para supervisão pedagógica',
      );
    }
  }
}