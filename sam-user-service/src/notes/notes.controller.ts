import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateAttendanceNoteDto } from './dto/create-note.dto';
import { UpdateAttendanceNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('sam/users/notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  create(@Body() body: CreateAttendanceNoteDto) {
    return this.service.create(body);
  }

  @Get('request/:requestId')
  findAllByRequest(@Param('requestId') requestId: string) {
    return this.service.findAllByRequest(requestId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateAttendanceNoteDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
