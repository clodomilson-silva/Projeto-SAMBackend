import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ActionTypeController } from './action-type.controller';
import { ActionTypeService } from './action-type.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActionTypeController],
  providers: [ActionTypeService],
  exports: [ActionTypeService],
})
export class ActionTypeModule {}
