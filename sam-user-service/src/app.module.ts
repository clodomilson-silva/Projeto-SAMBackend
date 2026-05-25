import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [PrismaModule, UsersModule, NotesModule, SessionsModule],
})
export class AppModule {}



