import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('sam/appointments/courses')
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Post()
  create(@Body() body: CreateCourseDto) {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query('courseTypeId') courseTypeId?: string,
    @Query('courseType') courseType?: string,
  ) {
    return this.service.findAll(courseTypeId, courseType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
