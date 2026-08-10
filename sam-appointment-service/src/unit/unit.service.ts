import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUnitDto) {
    const existing = await this.prisma.unit.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Unidade já cadastrada com este nome');
    }

    return this.prisma.unit.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.unit.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    return unit;
  }

  async update(id: string, data: UpdateUnitDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.unit.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Unidade já cadastrada com este nome');
      }
    }

    return this.prisma.unit.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.unit.delete({
      where: { id },
    });
    return { message: 'Unidade removida com sucesso' };
  }
}
