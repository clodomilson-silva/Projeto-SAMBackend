import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CollectiveInterventionController } from './collective-intervention.controller';
import { CollectiveInterventionService } from './collective-intervention.service';

@Module({
  imports: [PrismaModule],
  controllers: [CollectiveInterventionController],
  providers: [CollectiveInterventionService],
  exports: [CollectiveInterventionService],
})
export class CollectiveInterventionModule {}
