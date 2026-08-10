import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActionTypeDto } from './dto/create-action-type.dto';
import { UpdateActionTypeDto } from './dto/update-action-type.dto';

@Injectable()
export class ActionTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateActionTypeDto) {
    const existing = await this.prisma.actionType.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Tipo de ação já cadastrado com este nome');
    }

    return this.prisma.actionType.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.actionType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const actionType = await this.prisma.actionType.findUnique({
      where: { id },
    });

    if (!actionType) {
      throw new NotFoundException('Tipo de ação não encontrado');
    }

    return actionType;
  }

  async update(id: string, data: UpdateActionTypeDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.actionType.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Tipo de ação já cadastrado com este nome');
      }
    }

    return this.prisma.actionType.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.actionType.delete({
      where: { id },
    });
    return { message: 'Tipo de ação removido com sucesso' };
  }
}
