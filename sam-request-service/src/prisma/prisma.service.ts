import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '../../src/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to the database.');
        break;
      } catch (error: any) {
        retries--;
        this.logger.error(
          `Failed to connect to the database. Retries remaining: ${retries}. Error: ${error.message}`,
        );
        if (retries === 0) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
