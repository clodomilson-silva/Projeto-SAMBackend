import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    const existing = await this.prisma.course.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Curso já cadastrado com este nome');
    }

    return this.prisma.course.create({
      data: {
        name: data.name,
        unitId: data.unitId || null,
        courseTypeId: data.courseTypeId || null,
      },
      include: {
        unit: true,
        courseType: true,
      },
    });
  }

  async findAll(courseTypeId?: string, courseType?: string) {
    const where: any = {};
    if (courseTypeId) {
      where.courseTypeId = courseTypeId;
    } else if (courseType) {
      where.OR = [
        { courseTypeId: courseType },
        { courseType: { is: { name: courseType } } },
      ];
    }

    return this.prisma.course.findMany({
      where,
      include: {
        unit: true,
        courseType: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        unit: true,
        courseType: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  async update(id: string, data: UpdateCourseDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.course.findUnique({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Curso já cadastrado com este nome');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.unitId !== undefined) updateData.unitId = data.unitId || null;
    if (data.courseTypeId !== undefined) updateData.courseTypeId = data.courseTypeId || null;

    return this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        unit: true,
        courseType: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.course.delete({
      where: { id },
    });
    return { message: 'Curso removido com sucesso' };
  }
}
