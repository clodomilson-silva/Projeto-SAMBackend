import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintTypeDto } from './dto/create-complaint-type.dto';
import { UpdateComplaintTypeDto } from './dto/update-complaint-type.dto';

@Injectable()
export class ComplaintTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateComplaintTypeDto) {
    const existing = await this.prisma.complaintType.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Tipo de queixa já cadastrado com este nome');
    }

    return this.prisma.complaintType.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.complaintType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const complaintType = await this.prisma.complaintType.findUnique({
      where: { id },
    });

    if (!complaintType) {
      throw new NotFoundException('Tipo de queixa não encontrado');
    }

    return complaintType;
  }

  async update(id: string, data: UpdateComplaintTypeDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.complaintType.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Tipo de queixa já cadastrado com este nome');
      }
    }

    return this.prisma.complaintType.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.complaintType.delete({
      where: { id },
    });
    return { message: 'Tipo de queixa removido com sucesso' };
  }
}
