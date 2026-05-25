import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [PrismaModule, UsersModule, NotesModule],
})
export class AppModule {}


