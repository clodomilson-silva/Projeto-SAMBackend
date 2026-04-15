import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DossierStatus } from './dto/update-dossier-status.dto';
import { AppointmentStatus } from './dto/update-appointment-status.dto';
import { UpsertDossierDto } from './dto/upsert-dossier.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        requestId: data.requestId,
        psychologistId: data.psychologistId,
        scheduledAt: new Date(data.scheduledAt),
        location: data.location,
        notes: data.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const existing = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Atendimento não encontrado');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  async upsertDossier(data: UpsertDossierDto) {
    return this.prisma.dossier.upsert({
      where: { requestId: data.requestId },
      update: {
        psychologistId: data.psychologistId,
        requestDate: new Date(data.requestDate),
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        demandReport: data.demandReport,
        complaintTypologies: data.complaintTypologies ?? [],
        selectedActions: data.selectedActions ?? [],
        pendingIssues: data.pendingIssues,
        status: data.status ?? DossierStatus.EM_ANDAMENTO,
      },
      create: {
        requestId: data.requestId,
        psychologistId: data.psychologistId,
        requestDate: new Date(data.requestDate),
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        demandReport: data.demandReport,
        complaintTypologies: data.complaintTypologies ?? [],
        selectedActions: data.selectedActions ?? [],
        pendingIssues: data.pendingIssues,
        status: data.status ?? DossierStatus.EM_ANDAMENTO,
      },
    });
  }

  async findDossiers(psychologistId?: string) {
    return this.prisma.dossier.findMany({
      where: psychologistId ? { psychologistId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findDossierByRequest(requestId: string) {
    const dossier = await this.prisma.dossier.findUnique({
      where: { requestId },
    });

    if (!dossier) {
      throw new NotFoundException('Dossiê não encontrado para a solicitação');
    }

    return dossier;
  }
}
