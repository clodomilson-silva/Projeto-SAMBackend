import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectiveInterventionDto } from './dto/create-collective-intervention.dto';
import { UpdateCollectiveInterventionDto } from './dto/update-collective-intervention.dto';

@Injectable()
export class CollectiveInterventionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCollectiveInterventionDto) {
    return this.prisma.collectiveIntervention.create({
      data: {
        theme: data.theme,
        classCode: data.classCode ?? '',
        course: data.course ?? (data.targetAudience?.[0] ?? ''),
        targetAudience: data.targetAudience ?? [],
        unitId: data.unitId,
        unit: data.unit,
        instructor: data.instructor,
        date: new Date(data.date),
        eventTime: data.eventTime,
        presentPeople: data.presentPeople ?? [],
        actionReport: data.actionReport,
      },
    });
  }

  async findAll() {
    return this.prisma.collectiveIntervention.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const intervention = await this.prisma.collectiveIntervention.findUnique({
      where: { id },
    });

    if (!intervention) {
      throw new NotFoundException('Intervenção coletiva não encontrada');
    }

    return intervention;
  }

  async update(id: string, data: UpdateCollectiveInterventionDto) {
    await this.findOne(id);

    return this.prisma.collectiveIntervention.update({
      where: { id },
      data: {
        theme: data.theme,
        classCode: data.classCode,
        course: data.course,
        targetAudience: data.targetAudience,
        unitId: data.unitId,
        unit: data.unit,
        instructor: data.instructor,
        date: data.date ? new Date(data.date) : undefined,
        eventTime: data.eventTime,
        presentPeople: data.presentPeople,
        actionReport: data.actionReport,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.collectiveIntervention.delete({
      where: { id },
    });
    return { message: 'Intervenção coletiva removida com sucesso' };
  }

  async getPublicIntervention(id: string) {
    const intervention = await this.prisma.collectiveIntervention.findUnique({
      where: { id },
      select: {
        id: true,
        theme: true,
        unit: true,
        date: true,
        eventTime: true,
        instructor: true,
        targetAudience: true,
        course: true,
        classCode: true,
      },
    });

    if (!intervention) {
      throw new NotFoundException('Intervenção coletiva não encontrada');
    }

    return intervention;
  }

  async registerCheckin(id: string, data: any) {
    const intervention = await this.findOne(id);

    const attendee = await this.prisma.collectiveInterventionAttendee.create({
      data: {
        collectiveInterventionId: id,
        participantType: data.participantType,
        name: data.name,
        role: data.role,
        course: data.course,
        unit: data.unit,
        isEmployed: data.isEmployed,
        workplace: data.workplace,
        lgpdConsent: data.lgpdConsent ?? true,
      },
    });

    // Also update presentPeople list on intervention if not present
    if (!intervention.presentPeople.includes(data.name)) {
      await this.prisma.collectiveIntervention.update({
        where: { id },
        data: {
          presentPeople: [...intervention.presentPeople, data.name],
        },
      });
    }

    return attendee;
  }

  async getAttendees(id: string) {
    await this.findOne(id);
    return this.prisma.collectiveInterventionAttendee.findMany({
      where: { collectiveInterventionId: id },
      orderBy: { registeredAt: 'desc' },
    });
  }
}
