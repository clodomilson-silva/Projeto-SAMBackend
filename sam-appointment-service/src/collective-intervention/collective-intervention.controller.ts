import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CollectiveInterventionService } from './collective-intervention.service';
import { CreateCollectiveInterventionDto } from './dto/create-collective-intervention.dto';
import { UpdateCollectiveInterventionDto } from './dto/update-collective-intervention.dto';

@Controller('sam/appointments/collective-interventions')
export class CollectiveInterventionController {
  constructor(private readonly service: CollectiveInterventionService) {}

  @Post()
  create(@Body() body: CreateCollectiveInterventionDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/public')
  getPublicInfo(@Param('id') id: string) {
    return this.service.getPublicIntervention(id);
  }

  @Post(':id/checkin')
  checkin(@Param('id') id: string, @Body() body: any) {
    return this.service.registerCheckin(id, body);
  }

  @Get(':id/attendees')
  getAttendees(@Param('id') id: string) {
    return this.service.getAttendees(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCollectiveInterventionDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
