import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestService } from './request.service';

@Controller('sam/requests')
export class RequestController {
  constructor(private readonly service: RequestService) {}

  @Post()
  create(@Body() body: CreateRequestDto) {
    return this.service.create(body);
  }

  @Get()
  findAll(
    @Query('userRole') userRole?: string,
    @Query('userWorkUnit') userWorkUnit?: string,
    @Query('userAllowedUnits') userAllowedUnits?: string | string[],
    @Query('userId') userId?: string,
  ) {
    const allowedUnitsArray = typeof userAllowedUnits === 'string' 
      ? userAllowedUnits.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(userAllowedUnits) ? userAllowedUnits : []);

    return this.service.findAll(userRole, userWorkUnit, allowedUnitsArray, userId);
  }

  @Get('notifications')
  getNotifications(
    @Query('psychologistId') psychologistId: string,
    @Query('userWorkUnit') userWorkUnit?: string,
    @Query('userAllowedUnits') userAllowedUnits?: string | string[],
  ) {
    const allowedUnitsArray = typeof userAllowedUnits === 'string'
      ? userAllowedUnits.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(userAllowedUnits) ? userAllowedUnits : []);

    return this.service.getNotifications(psychologistId, userWorkUnit, allowedUnitsArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateRequestDto) {
    return this.service.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateRequestStatusDto,
  ) {
    return this.service.updateStatus(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}