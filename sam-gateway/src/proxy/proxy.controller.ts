import {
  Body,
  Controller,
  Delete,
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

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('patch', `/sam/users/${id}`, body, token);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.users('delete', `/sam/users/${id}`, undefined, token);
  }

  @Post('users/notes')
  createNote(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.users('post', '/sam/users/notes', body, token);
  }

  @Get('users/notes/request/:requestId')
  findNotesByRequest(
    @Param('requestId') requestId: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users(
      'get',
      `/sam/users/notes/request/${requestId}`,
      undefined,
      token,
    );
  }

  @Get('users/notes/:id')
  findOneNote(
    @Param('id') id: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('get', `/sam/users/notes/${id}`, undefined, token);
  }

  @Patch('users/notes/:id')
  updateNote(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('patch', `/sam/users/notes/${id}`, body, token);
  }

  @Delete('users/notes/:id')
  deleteNote(
    @Param('id') id: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('delete', `/sam/users/notes/${id}`, undefined, token);
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

  @Patch('requests/:id')
  updateRequest(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.requests('patch', `/sam/requests/${id}`, body, token);
  }

  @Delete('requests/:id')
  deleteRequest(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.requests('delete', `/sam/requests/${id}`, undefined, token);
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

  @Get('appointments/dashboard/psychologist')
  psychologistDashboard(
    @Headers('authorization') token?: string,
    @Query('psychologistId') psychologistId?: string,
    @Query('periodType') periodType?: string,
    @Query('referenceDate') referenceDate?: string,
  ) {
    const query = new URLSearchParams();
    if (psychologistId) query.set('psychologistId', psychologistId);
    if (periodType) query.set('periodType', periodType);
    if (referenceDate) query.set('referenceDate', referenceDate);

    const path = `/sam/appointments/dashboard/psychologist${
      query.toString() ? `?${query.toString()}` : ''
    }`;

    return this.proxyService.appointments('get', path, undefined, token);
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

  @Get('appointments/dossiers/:id')
  findDossierById(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments(
      'get',
      `/sam/appointments/dossiers/${id}`,
      undefined,
      token,
    );
  }

  @Patch('appointments/dossiers/:id')
  updateDossier(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'patch',
      `/sam/appointments/dossiers/${id}`,
      body,
      token,
    );
  }

  @Delete('appointments/dossiers/:id')
  deleteDossier(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments(
      'delete',
      `/sam/appointments/dossiers/${id}`,
      undefined,
      token,
    );
  }

  @Post('appointments/dossiers/:dossierId/records')
  createRecord(
    @Param('dossierId') dossierId: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'post',
      `/sam/appointments/dossiers/${dossierId}/records`,
      body,
      token,
    );
  }

  @Get('appointments/dossiers/:dossierId/records')
  findRecordsByDossier(
    @Param('dossierId') dossierId: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'get',
      `/sam/appointments/dossiers/${dossierId}/records`,
      undefined,
      token,
    );
  }

  @Get('appointments/records/:id')
  findOneRecord(
    @Param('id') id: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'get',
      `/sam/appointments/records/${id}`,
      undefined,
      token,
    );
  }

  @Patch('appointments/records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'patch',
      `/sam/appointments/records/${id}`,
      body,
      token,
    );
  }

  @Delete('appointments/records/:id')
  deleteRecord(
    @Param('id') id: string,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments(
      'delete',
      `/sam/appointments/records/${id}`,
      undefined,
      token,
    );
  }
}

