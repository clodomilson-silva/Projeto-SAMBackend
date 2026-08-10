import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestStatus, UpdateRequestStatusDto } from './dto/update-request-status.dto';

function normalizeCourseType(val?: string): 'APRENDIZAGEM' | 'TECNICO' | 'QUALIFICACAO' {
  if (!val) return 'APRENDIZAGEM';
  const norm = val.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('TECNIC')) return 'TECNICO';
  if (norm.includes('QUALIFIC')) return 'QUALIFICACAO';
  if (norm.includes('APRENDIZ')) return 'APRENDIZAGEM';
  if (norm === 'TECNICO' || norm === 'QUALIFICACAO' || norm === 'APRENDIZAGEM') {
    return norm as 'APRENDIZAGEM' | 'TECNICO' | 'QUALIFICACAO';
  }
  return 'APRENDIZAGEM';
}

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRequestDto) {
    const protocolNumber = await this.generateProtocol(data.unitId);
    return this.prisma.request.create({
      data: {
        protocolNumber,
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: normalizeCourseType(data.courseType),
        courseName: data.courseName,
        reason: data.reason,
        requesterId: data.requesterId,
        supervisorDescription: data.demandDescription,
        unitId: data.unitId,
        status: data.status ?? undefined,
      },
    });
  }

  async findAll(
    userRole?: string,
    userWorkUnit?: string,
    userAllowedUnits: string[] = [],
    userId?: string,
  ) {
    const where: any = {};

    if (userRole === 'SUPERVISAO') {
      const orConditions: any[] = [];
      if (userWorkUnit) {
        orConditions.push({ unitId: userWorkUnit });
      }
      if (userId) {
        orConditions.push({ requesterId: userId });
      }
      if (orConditions.length > 0) {
        where.OR = orConditions;
      } else {
        where.id = 'none';
      }
    } else if (userRole === 'PSICOLOGA_EDUCACIONAL') {
      const allowedUnits = Array.from(
        new Set([userWorkUnit, ...userAllowedUnits].filter(Boolean) as string[]),
      );
      const orConditions: any[] = [];
      if (userId) {
        orConditions.push({ targetPsychologistId: userId });
      }
      if (allowedUnits.length > 0) {
        orConditions.push({ unitId: { in: allowedUnits } });
        for (const unit of allowedUnits) {
          orConditions.push({ protocolNumber: { startsWith: unit } });
        }
      }
      if (orConditions.length > 0) {
        where.OR = orConditions;
      } else {
        where.id = 'none';
      }
      where.status = {
        notIn: [RequestStatus.EM_ATENDIMENTO, RequestStatus.CONCLUIDA],
      };
    }

    return this.prisma.request.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotifications(
    psychologistId: string,
    userWorkUnit?: string,
    userAllowedUnits: string[] = [],
  ) {
    if (!psychologistId) {
      return {
        count: 0,
        requests: [],
      };
    }

    const allowedUnits = Array.from(
      new Set([userWorkUnit, ...userAllowedUnits].filter(Boolean) as string[]),
    );

    const orConditions: any[] = [
      {
        targetPsychologistId: psychologistId,
        status: {
          in: [RequestStatus.PENDENTE, RequestStatus.EM_ANALISE],
        },
      },
    ];

    if (allowedUnits.length > 0) {
      const unitConditions: any[] = [
        { unitId: { in: allowedUnits } },
      ];
      for (const unit of allowedUnits) {
        unitConditions.push({ protocolNumber: { startsWith: unit } });
      }

      orConditions.push({
        targetPsychologistId: null,
        status: RequestStatus.PENDENTE,
        OR: unitConditions,
      });
    }

    return this.prisma.request.findMany({
      where: {
        OR: orConditions,
      },
      orderBy: { createdAt: 'desc' },
    }).then((requests) => ({
      count: requests.length,
      requests,
    }));
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return request;
  }

  async updateStatus(id: string, data: UpdateRequestStatusDto) {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    const nextStatus = data.status;

    let dossierId: string | null = null;
    if (nextStatus === RequestStatus.EM_ATENDIMENTO) {
      const targetPsychologistId = existingRequest.targetPsychologistId;
      if (!targetPsychologistId) {
        throw new BadRequestException('Psicólogo(a) responsável não definido para atendimento');
      }

      try {
        const payload: any = {
          requestId: existingRequest.id,
          psychologistId: targetPsychologistId,
          requestDate: existingRequest.requestDate.toISOString(),
          attendanceStartDate: new Date().toISOString(),
          requesterName: existingRequest.requesterName,
          studentName: existingRequest.studentName,
          studentRegistration: existingRequest.studentRegistration,
          classCode: existingRequest.classCode,
          courseType: existingRequest.courseType,
          demandReport: existingRequest.reason,
        };

        if ((existingRequest as any).courseName) {
          payload.courseName = (existingRequest as any).courseName;
        }

        const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3004';
        const response = await fetch(`${appointmentServiceUrl}/sam/appointments/dossiers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Erro ao criar dossiê: ${response.statusText} - ${errBody}`);
        }

        const dossier = await response.json();
        dossierId = dossier.id;
      } catch (error: any) {
        throw new BadRequestException(`Falha ao integrar criação de dossiê: ${error.message}`);
      }
    }

    const updated = await this.prisma.request.update({
      where: { id },
      data: {
        status: data.status,
        concludedAt: data.status === RequestStatus.CONCLUIDA ? new Date() : null,
      },
    });

    return {
      ...updated,
      dossierId,
    };
  }

  async update(id: string, data: UpdateRequestDto) {
    const existingRequest = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    const nextStatus = data.status ?? existingRequest.status;

    let dossierId: string | null = null;
    if (nextStatus === RequestStatus.EM_ATENDIMENTO) {
      const targetPsychologistId = typeof data.targetPsychologistId !== 'undefined'
        ? data.targetPsychologistId
        : existingRequest.targetPsychologistId;

      if (!targetPsychologistId) {
        throw new BadRequestException('Psicólogo(a) responsável não definido para atendimento');
      }

      try {
        const payload: any = {
          requestId: existingRequest.id,
          psychologistId: targetPsychologistId,
          requestDate: existingRequest.requestDate.toISOString(),
          attendanceStartDate: new Date().toISOString(),
          requesterName: data.requesterName ?? existingRequest.requesterName,
          studentName: data.studentName ?? existingRequest.studentName,
          studentRegistration: data.studentRegistration ?? existingRequest.studentRegistration,
          classCode: data.classCode ?? existingRequest.classCode,
          courseType: data.courseType ?? existingRequest.courseType,
          demandReport: data.reason ?? existingRequest.reason,
        };

        if (data.hasOwnProperty('courseName') || (existingRequest as any).courseName) {
          const cName = (data as any).courseName ?? (existingRequest as any).courseName;
          if (cName) {
            payload.courseName = cName;
          }
        }

        const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3004';
        const response = await fetch(`${appointmentServiceUrl}/sam/appointments/dossiers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Erro ao criar dossiê: ${response.statusText} - ${errBody}`);
        }

        const dossier = await response.json();
        dossierId = dossier.id;
      } catch (error: any) {
        throw new BadRequestException(`Falha ao integrar criação de dossiê: ${error.message}`);
      }
    }

    const updated = await this.prisma.request.update({
      where: { id },
      data: {
        requesterName: data.requesterName,
        studentName: data.studentName,
        studentRegistration: data.studentRegistration,
        classCode: data.classCode,
        courseType: data.courseType ? normalizeCourseType(data.courseType) : undefined,
        courseName: data.courseName,
        reason: data.reason,
        supervisorDescription: data.demandDescription,
        status: data.status,
        targetPsychologistId:
          typeof data.targetPsychologistId === 'undefined'
            ? undefined
            : data.targetPsychologistId,
        concludedAt: nextStatus === RequestStatus.CONCLUIDA ? new Date() : null,
      },
    });

    return {
      ...updated,
      dossierId,
    };
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

  private async generateProtocol(unitId?: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const dateTime = `${year}${month}${day}${hour}${minute}${second}`;
    const sector = unitId ? unitId.toUpperCase() : 'SAM';
    return `${sector}-${dateTime}`;
  }
}