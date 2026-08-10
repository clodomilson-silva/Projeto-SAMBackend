import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourseModalityService } from './course-modality.service';
import { CreateCourseModalityDto } from './dto/create-course-modality.dto';
import { UpdateCourseModalityDto } from './dto/update-course-modality.dto';

@Controller(['sam/appointments/course-modalities', 'sam/appointments/course-types'])
export class CourseModalityController {
  constructor(private readonly service: CourseModalityService) {}

  @Post()
  create(@Body() body: CreateCourseModalityDto) {
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
  update(@Param('id') id: string, @Body() body: UpdateCourseModalityDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
