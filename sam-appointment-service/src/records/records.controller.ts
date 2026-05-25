import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateDossierRecordDto } from './dto/create-record.dto';
import { UpdateDossierRecordDto } from './dto/update-record.dto';
import { RecordsService } from './records.service';

@Controller('sam/appointments')
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  @Post('dossiers/:dossierId/records')
  create(
    @Param('dossierId') dossierId: string,
    @Body() body: CreateDossierRecordDto,
  ) {
    return this.service.create(dossierId, body);
  }

  @Get('dossiers/:dossierId/records')
  findAllByDossier(@Param('dossierId') dossierId: string) {
    return this.service.findAllByDossier(dossierId);
  }

  @Get('records/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('records/:id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateDossierRecordDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete('records/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
