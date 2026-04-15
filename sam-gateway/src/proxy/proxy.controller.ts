import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('sam')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('auth/login')
  login(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/login', body);
  }

  @Post('users')
  createUser(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.users('post', '/sam/users', body, token);
  }

  @Get('users')
  findUsers(@Headers('authorization') token?: string) {
    return this.proxyService.users('get', '/sam/users', undefined, token);
  }

  @Post('requests')
  createRequest(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.requests('post', '/sam/requests', body, token);
  }

  @Get('requests')
  findRequests(@Headers('authorization') token?: string) {
    return this.proxyService.requests('get', '/sam/requests', undefined, token);
  }

  @Patch('requests/:id/status')
  updateRequestStatus(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.requests(
      'patch',
      `/sam/requests/${id}/status`,
      body,
      token,
    );
  }

  @Post('appointments')
  createAppointment(
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'post',
      '/sam/appointments',
      body,
      token,
    );
  }

  @Get('appointments')
  findAppointments(@Headers('authorization') token?: string) {
    return this.proxyService.appointments(
      'get',
      '/sam/appointments',
      undefined,
      token,
    );
  }

  @Patch('appointments/:id/status')
  updateAppointmentStatus(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'patch',
      `/sam/appointments/${id}/status`,
      body,
      token,
    );
  }

  @Post('appointments/dossiers')
  upsertDossier(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments(
      'post',
      '/sam/appointments/dossiers',
      body,
      token,
    );
  }

  @Get('appointments/dossiers')
  findDossiers(
    @Headers('authorization') token?: string,
    @Query('psychologistId') psychologistId?: string,
  ) {
    const path = psychologistId
      ? `/sam/appointments/dossiers?psychologistId=${encodeURIComponent(psychologistId)}`
      : '/sam/appointments/dossiers';
    return this.proxyService.appointments('get', path, undefined, token);
  }

  @Get('appointments/dossiers/request/:requestId')
  findDossierByRequest(
    @Param('requestId') requestId: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'get',
      `/sam/appointments/dossiers/request/${requestId}`,
      undefined,
      token,
    );
  }
}
