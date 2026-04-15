import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [PrismaModule, RequestModule],
})
export class AppModule {}
