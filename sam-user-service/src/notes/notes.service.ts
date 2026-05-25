import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceNoteDto } from './dto/create-note.dto';
import { UpdateAttendanceNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttendanceNoteDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.attendanceNote.create({
      data: {
        userId: data.userId,
        requestId: data.requestId,
        title: data.title,
        description: data.description,
        optionTags: data.optionTags ?? [],
      },
    });
  }

  async findAllByRequest(requestId: string) {
    return this.prisma.attendanceNote.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            crp: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.attendanceNote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            crp: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Anotação de atendimento não encontrada');
    }

    return note;
  }

  async update(id: string, data: UpdateAttendanceNoteDto) {
    const existing = await this.prisma.attendanceNote.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Anotação de atendimento não encontrada');
    }

    return this.prisma.attendanceNote.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        optionTags: data.optionTags,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.attendanceNote.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Anotação de atendimento não encontrada');
    }

    await this.prisma.attendanceNote.delete({
      where: { id },
    });

    return { message: 'Anotação de atendimento removida com sucesso' };
  }
}
