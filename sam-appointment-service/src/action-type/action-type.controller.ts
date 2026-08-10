import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActionTypeService } from './action-type.service';
import { CreateActionTypeDto } from './dto/create-action-type.dto';
import { UpdateActionTypeDto } from './dto/update-action-type.dto';

@Controller('sam/appointments/action-types')
export class ActionTypeController {
  constructor(private readonly service: ActionTypeService) {}

  @Post()
  create(@Body() body: CreateActionTypeDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateActionTypeDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
