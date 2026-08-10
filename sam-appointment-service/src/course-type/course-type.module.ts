import { Module } from '@nestjs/common';
import { CourseTypeController } from './course-type.controller';
import { CourseTypeService } from './course-type.service';

@Module({
  controllers: [CourseTypeController],
  providers: [CourseTypeService],
  exports: [CourseTypeService],
})
export class CourseTypeModule {}
