import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestStatus, UpdateRequestStatusDto } from './dto/update-request-status.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRequestDto) {
    return this.prisma.request.create({
      data: {
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        reason: data.reason,
        priority: data.priority,
        requesterId: data.requesterId,
        supervisorDescription: data.demandDescription,
        unitId: data.unitId,
      },
    });
  }

  async findAll() {
    return this.prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, data: UpdateRequestStatusDto) {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return this.prisma.request.update({
      where: { id },
      data: {
        status: data.status,
        concludedAt: data.status === RequestStatus.CONCLUIDA ? new Date() : null,
      },
    });
  }

  async update(id: string, data: UpdateRequestDto) {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    const nextStatus = data.status ?? existingRequest.status;

    return this.prisma.request.update({
      where: { id },
      data: {
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        reason: data.reason,
        priority: data.priority,
        supervisorDescription: data.demandDescription,
        status: data.status,
        targetPsychologistId:
          typeof data.targetPsychologistId === 'undefined'
            ? undefined
            : data.targetPsychologistId,
        concludedAt: nextStatus === RequestStatus.CONCLUIDA ? new Date() : null,
      },
    });
  }

  async remove(id: string) {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    await this.prisma.request.delete({
      where: { id },
    });

    return { message: 'Solicitação removida com sucesso' };
  }
}