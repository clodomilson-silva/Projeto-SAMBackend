import { Module } from '@nestjs/common';
import { ActionTypeModule } from './action-type/action-type.module';
import { AppointmentModule } from './appointment/appointment.module';
import { CollectiveInterventionModule } from './collective-intervention/collective-intervention.module';
import { ComplaintTypeModule } from './complaint-type/complaint-type.module';
import { CourseModalityModule } from './course-modality/course-modality.module';
import { CourseTypeModule } from './course-type/course-type.module';
import { CourseModule } from './course/course.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordsModule } from './records/records.module';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    PrismaModule,
    AppointmentModule,
    RecordsModule,
    ComplaintTypeModule,
    ActionTypeModule,
    CollectiveInterventionModule,
    CourseModule,
    CourseTypeModule,
    CourseModalityModule,
    UnitModule,
  ],
})
export class AppModule {}

