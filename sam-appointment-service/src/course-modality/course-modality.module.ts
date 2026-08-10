import { Module } from '@nestjs/common';
import { CourseModalityController } from './course-modality.controller';
import { CourseModalityService } from './course-modality.service';

@Module({
  controllers: [CourseModalityController],
  providers: [CourseModalityService],
  exports: [CourseModalityService],
})
export class CourseModalityModule {}
