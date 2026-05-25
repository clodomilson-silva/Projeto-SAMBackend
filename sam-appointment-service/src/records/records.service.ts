import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDossierRecordDto } from './dto/create-record.dto';
import { UpdateDossierRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dossierId: string, data: CreateDossierRecordDto) {
    const dossier = await this.prisma.dossier.findUnique({
      where: { id: dossierId },
    });

    if (!dossier) {
      throw new NotFoundException('Dossiê não encontrado');
    }

    return this.prisma.dossierRecord.create({
      data: {
        dossierId,
        title: data.title,
        description: data.description,
        optionTags: data.optionTags ?? [],
        visibility: data.visibility,
        createdBy: data.createdBy,
      },
    });
  }

  async findAllByDossier(dossierId: string) {
    const dossier = await this.prisma.dossier.findUnique({
      where: { id: dossierId },
    });

    if (!dossier) {
      throw new NotFoundException('Dossiê não encontrado');
    }

    return this.prisma.dossierRecord.findMany({
      where: { dossierId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.dossierRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Registro de dossiê não encontrado');
    }

    return record;
  }

  async update(id: string, data: UpdateDossierRecordDto) {
    const existing = await this.prisma.dossierRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Registro de dossiê não encontrado');
    }

    return this.prisma.dossierRecord.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        optionTags: data.optionTags,
        visibility: data.visibility,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.dossierRecord.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Registro de dossiê não encontrado');
    }

    await this.prisma.dossierRecord.delete({
      where: { id },
    });

    return { message: 'Registro de dossiê removido com sucesso' };
  }
}
