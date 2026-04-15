import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';

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
        workUnit: data.role === UserRole.SUPERVISAO ? data.workUnit : null,
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

  private validateRoleRequirements(data: CreateUserDto) {
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