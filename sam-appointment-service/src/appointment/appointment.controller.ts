import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PsychologistDashboardQueryDto } from './dto/psychologist-dashboard-query.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { UpsertDossierDto } from './dto/upsert-dossier.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentService } from './appointment.service';
import { ReopenDossierDto } from './dto/reopen-dossier.dto';

@Controller('sam/appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  create(@Body() body: CreateAppointmentDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('dashboard/psychologist')
  psychologistDashboard(@Query() query: PsychologistDashboardQueryDto) {
    return this.service.psychologistDashboard(query);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentStatusDto,
  ) {
    return this.service.updateStatus(id, body.status);
  }

  @Post('dossiers')
  upsertDossier(@Body() body: UpsertDossierDto) {
    return this.service.upsertDossier(body);
  }

  @Get('dossiers')
  findDossiers(@Query('psychologistId') psychologistId?: string) {
    return this.service.findDossiers(psychologistId);
  }

  @Get('dossiers/request/:requestId')
  findDossierByRequest(@Param('requestId') requestId: string) {
    return this.service.findDossierByRequest(requestId);
  }

  @Get('dossiers/:id')
  findDossierById(@Param('id') id: string) {
    return this.service.findDossierById(id);
  }

  @Patch('dossiers/:id')
  updateDossier(@Param('id') id: string, @Body() body: UpdateDossierDto) {
    return this.service.updateDossier(id, body);
  }

  @Post('dossiers/:id/reopen')
  reopenDossier(@Param('id') id: string, @Body() body: ReopenDossierDto) {
    return this.service.reopenDossier(id, body);
  }

  @Delete('dossiers/:id')
  removeDossier(@Param('id') id: string) {
    return this.service.removeDossier(id);
  }
}
