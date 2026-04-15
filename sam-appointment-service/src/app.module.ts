import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AppointmentModule],
})
export class AppModule {}
