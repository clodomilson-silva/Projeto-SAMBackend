import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseModalityDto } from './dto/create-course-modality.dto';
import { UpdateCourseModalityDto } from './dto/update-course-modality.dto';

@Injectable()
export class CourseModalityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseModalityDto) {
    const existing = await this.prisma.courseTypeEntity.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Modalidade de curso já cadastrada com este nome');
    }

    return this.prisma.courseTypeEntity.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.courseTypeEntity.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.courseTypeEntity.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Modalidade de curso não encontrada');
    }

    return item;
  }

  async update(id: string, data: UpdateCourseModalityDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.courseTypeEntity.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Modalidade de curso já cadastrada com este nome');
      }
    }

    return this.prisma.courseTypeEntity.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.courseTypeEntity.delete({
      where: { id },
    });
    return { message: 'Modalidade de curso removida com sucesso' };
  }
}
