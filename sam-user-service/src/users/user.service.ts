import {
  BadRequestException,
  ConflictException,
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
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crp: true,
        workUnit: true,
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
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
      passwordHash?: string;
    } = {};

    if (typeof data.name !== 'undefined') updateData.name = data.name;
    if (typeof data.email !== 'undefined') updateData.email = data.email;
    if (typeof data.role !== 'undefined') updateData.role = data.role;
    if (typeof data.password !== 'undefined') {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
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