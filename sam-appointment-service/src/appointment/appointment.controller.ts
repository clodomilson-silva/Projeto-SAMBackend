import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpsertDossierDto } from './dto/upsert-dossier.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentService } from './appointment.service';

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
}
