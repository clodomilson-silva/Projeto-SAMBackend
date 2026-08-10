import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComplaintTypeController } from './complaint-type.controller';
import { ComplaintTypeService } from './complaint-type.service';

@Module({
  imports: [PrismaModule],
  controllers: [ComplaintTypeController],
  providers: [ComplaintTypeService],
  exports: [ComplaintTypeService],
})
export class ComplaintTypeModule {}
