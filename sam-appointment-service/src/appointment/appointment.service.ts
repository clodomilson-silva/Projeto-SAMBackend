import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  DashboardPeriodType,
  PsychologistDashboardQueryDto,
} from './dto/psychologist-dashboard-query.dto';
import { DossierStatus } from './dto/update-dossier-status.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
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

  async psychologistDashboard(query: PsychologistDashboardQueryDto) {
    const { from, to, periodType } = this.resolvePeriod(
      query.periodType ?? DashboardPeriodType.MONTH,
      query.referenceDate,
    );

    const [appointments, dossiers] = await Promise.all([
      this.prisma.appointment.findMany({
        where: {
          psychologistId: query.psychologistId,
          scheduledAt: {
            gte: from,
            lte: to,
          },
        },
        select: {
          id: true,
          status: true,
        },
      }),
      this.prisma.dossier.findMany({
        where: {
          psychologistId: query.psychologistId,
          requestDate: {
            gte: from,
            lte: to,
          },
        },
        select: {
          id: true,
          requestId: true,
          requesterName: true,
          studentName: true,
          pendingIssues: true,
          updatedAt: true,
          complaintTypologies: true,
          selectedActions: true,
        },
      }),
    ]);

    const topComplaintTypologies = this.countTopItems(
      dossiers.flatMap((item) => item.complaintTypologies),
    );
    const topActions = this.countTopItems(
      dossiers.flatMap((item) => item.selectedActions),
    );

    const pendingAttendances = dossiers
      .filter((item) => item.pendingIssues && item.pendingIssues.trim() !== '')
      .map((item) => ({
        dossierId: item.id,
        requestId: item.requestId,
        requesterName: item.requesterName,
        studentName: item.studentName,
        pendingIssues: item.pendingIssues,
        updatedAt: item.updatedAt,
      }));

    const summary = {
      totalAttendances: appointments.length,
      completed: appointments.filter((item) => item.status === AppointmentStatus.REALIZADO)
        .length,
      inProgress: appointments.filter((item) => item.status === AppointmentStatus.AGENDADO)
        .length,
      cancelled: appointments.filter((item) => item.status === AppointmentStatus.CANCELADO)
        .length,
      withPendingIssues: pendingAttendances.length,
    };

    return {
      period: {
        type: periodType,
        from,
        to,
      },
      summary,
      topComplaintTypologies,
      topActions,
      pendingAttendances,
    };
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
        attendanceStartDate: data.attendanceStartDate
          ? new Date(data.attendanceStartDate)
          : undefined,
        attendanceEndDate: data.attendanceEndDate ? new Date(data.attendanceEndDate) : undefined,
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        demandReport: data.demandReport,
        annotations: data.annotations,
        complaintTypologies: data.complaintTypologies ?? [],
        selectedActions: data.selectedActions ?? [],
        pendingIssues: data.pendingIssues,
        status: data.status ?? DossierStatus.EM_ANDAMENTO,
      },
      create: {
        requestId: data.requestId,
        psychologistId: data.psychologistId,
        requestDate: new Date(data.requestDate),
        attendanceStartDate: data.attendanceStartDate
          ? new Date(data.attendanceStartDate)
          : undefined,
        attendanceEndDate: data.attendanceEndDate ? new Date(data.attendanceEndDate) : undefined,
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        demandReport: data.demandReport,
        annotations: data.annotations,
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

  async findDossierById(id: string) {
    const dossier = await this.prisma.dossier.findUnique({
      where: { id },
    });

    if (!dossier) {
      throw new NotFoundException('Dossiê não encontrado');
    }

    return dossier;
  }

  async updateDossier(id: string, data: UpdateDossierDto) {
    const existingDossier = await this.findDossierById(id);

    const nextStatus = data.status ?? existingDossier.status;
    const hasEndDateInPayload = typeof data.attendanceEndDate !== 'undefined';
    const hasEndDateInCurrent = !!existingDossier.attendanceEndDate;

    if (nextStatus === DossierStatus.CONCLUIDO && !hasEndDateInPayload && !hasEndDateInCurrent) {
      throw new BadRequestException(
        'Informe a data de encerramento para concluir o atendimento',
      );
    }

    return this.prisma.dossier.update({
      where: { id },
      data: {
        psychologistId: data.psychologistId,
        requestDate: data.requestDate ? new Date(data.requestDate) : undefined,
        attendanceStartDate:
          typeof data.attendanceStartDate === 'undefined'
            ? undefined
            : data.attendanceStartDate
              ? new Date(data.attendanceStartDate)
              : null,
        attendanceEndDate:
          typeof data.attendanceEndDate === 'undefined'
            ? nextStatus === DossierStatus.CONCLUIDO && !hasEndDateInCurrent
              ? new Date()
              : undefined
            : data.attendanceEndDate
              ? new Date(data.attendanceEndDate)
              : null,
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType,
        demandReport: data.demandReport,
        annotations: typeof data.annotations === 'undefined' ? undefined : data.annotations,
        complaintTypologies: data.complaintTypologies,
        selectedActions: data.selectedActions,
        pendingIssues: typeof data.pendingIssues === 'undefined' ? undefined : data.pendingIssues,
        status: data.status,
      },
    });
  }

  async removeDossier(id: string) {
    await this.findDossierById(id);
    await this.prisma.dossier.delete({ where: { id } });
    return { message: 'Dossiê removido com sucesso' };
  }

  private resolvePeriod(periodType: DashboardPeriodType, referenceDate?: string) {
    const baseDate = referenceDate ? new Date(referenceDate) : new Date();
    const from = new Date(baseDate);
    const to = new Date(baseDate);

    if (periodType === DashboardPeriodType.WEEK) {
      const day = (baseDate.getUTCDay() + 6) % 7;
      from.setUTCDate(baseDate.getUTCDate() - day);
      from.setUTCHours(0, 0, 0, 0);
      to.setTime(from.getTime());
      to.setUTCDate(from.getUTCDate() + 6);
      to.setUTCHours(23, 59, 59, 999);
      return { from, to, periodType };
    }

    from.setUTCDate(1);
    from.setUTCHours(0, 0, 0, 0);
    to.setUTCMonth(baseDate.getUTCMonth() + 1, 0);
    to.setUTCHours(23, 59, 59, 999);

    return { from, to, periodType };
  }

  private countTopItems(items: string[]) {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = item.trim();
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
