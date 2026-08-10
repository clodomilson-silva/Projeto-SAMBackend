import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseTypeDto } from './dto/create-course-type.dto';
import { UpdateCourseTypeDto } from './dto/update-course-type.dto';

@Injectable()
export class CourseTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseTypeDto) {
    const existing = await this.prisma.courseTypeEntity.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Tipo de curso já cadastrado com este nome');
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
    const courseType = await this.prisma.courseTypeEntity.findUnique({
      where: { id },
    });

    if (!courseType) {
      throw new NotFoundException('Tipo de curso não encontrado');
    }

    return courseType;
  }

  async update(id: string, data: UpdateCourseTypeDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.courseTypeEntity.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Tipo de curso já cadastrado com este nome');
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
    return { message: 'Tipo de curso removido com sucesso' };
  }
}
