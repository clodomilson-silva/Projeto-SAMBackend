import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ComplaintTypeService } from './complaint-type.service';
import { CreateComplaintTypeDto } from './dto/create-complaint-type.dto';
import { UpdateComplaintTypeDto } from './dto/update-complaint-type.dto';

@Controller('sam/appointments/complaint-types')
export class ComplaintTypeController {
  constructor(private readonly service: ComplaintTypeService) {}

  @Post()
  create(@Body() body: CreateComplaintTypeDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateComplaintTypeDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
