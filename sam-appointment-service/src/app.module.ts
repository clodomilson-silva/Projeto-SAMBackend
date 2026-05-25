import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [PrismaModule, AppointmentModule, RecordsModule],
})
export class AppModule {}

