import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('sam')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('auth/login')
  login(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/login', body);
  }

  @Post('auth/refresh')
  refresh(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/refresh', body);
  }

  @Post('auth/logout')
  logout(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/logout', body);
  }

  @Post('auth/register')
  register(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/register', body);
  }

  @Post('auth/request-reset')
  requestReset(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/request-reset', body);
  }

  @Post('auth/reset-password')
  resetPassword(@Body() body: unknown) {
    return this.proxyService.auth('post', '/sam/auth/reset-password', body);
  }

  @Post('users')
  createUser(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.users('post', '/sam/users', body, token);
  }

  @Get('users')
  findUsers(@Headers('authorization') token?: string) {
    return this.proxyService.users('get', '/sam/users', undefined, token);
  }

  @Patch('users/:id/authorize')
  authorizeUser(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('patch', `/sam/users/${id}/authorize`, body, token);
  }

  @Post('users/:id/reset-password')
  adminResetUserPassword(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.users('post', `/sam/users/${id}/reset-password`, body, token);
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
    const role = this.getRoleFromToken(token);
    if (role === 'ADMIN') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.requests('post', '/sam/requests', body, token);
  }

  @Get('requests')
  findRequests(@Headers('authorization') token?: string) {
    return this.proxyService.requests('get', '/sam/requests', undefined, token);
  }

  @Get('requests/notifications')
  getNotifications(
    @Query('psychologistId') psychologistId?: string,
    @Headers('authorization') token?: string,
  ) {
    const path = psychologistId
      ? `/sam/requests/notifications?psychologistId=${encodeURIComponent(psychologistId)}`
      : '/sam/requests/notifications';
    return this.proxyService.requests('get', path, undefined, token);
  }

  @Get('requests/:id')
  findOneRequest(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.requests('get', `/sam/requests/${id}`, undefined, token);
  }

  @Patch('requests/:id/status')
  updateRequestStatus(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    if (role === 'ADMIN') {
      throw new ForbiddenException('Acesso negado');
    }
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
    const role = this.getRoleFromToken(token);
    if (role === 'ADMIN') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.requests('patch', `/sam/requests/${id}`, body, token);
  }

  @Delete('requests/:id')
  deleteRequest(@Param('id') id: string, @Headers('authorization') token?: string) {
    const role = this.getRoleFromToken(token);
    if (role === 'ADMIN') {
      throw new ForbiddenException('Acesso negado');
    }
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
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
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
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'get',
      `/sam/appointments/dossiers/request/${requestId}`,
      undefined,
      token,
    );
  }

  @Get('appointments/dossiers/:id')
  findDossierById(@Param('id') id: string, @Headers('authorization') token?: string) {
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
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
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'patch',
      `/sam/appointments/dossiers/${id}`,
      body,
      token,
    );
  }

  @Post('appointments/dossiers/:id/reopen')
  reopenDossier(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'post',
      `/sam/appointments/dossiers/${id}/reopen`,
      body,
      token,
    );
  }

  @Delete('appointments/dossiers/:id')
  deleteDossier(@Param('id') id: string, @Headers('authorization') token?: string) {
    const role = this.getRoleFromToken(token);
    if (role !== 'ADMIN' && role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'delete',
      `/sam/appointments/dossiers/${id}`,
      undefined,
      token,
    );
  }

  @Post('appointments/complaint-types')
  createComplaintType(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/complaint-types', body, token);
  }

  @Get('appointments/complaint-types')
  findComplaintTypes(@Query('onlyActive') onlyActive?: string, @Headers('authorization') token?: string) {
    const path = onlyActive
      ? `/sam/appointments/complaint-types?onlyActive=${encodeURIComponent(onlyActive)}`
      : '/sam/appointments/complaint-types';
    return this.proxyService.appointments('get', path, undefined, token);
  }

  @Get('appointments/complaint-types/:id')
  findOneComplaintType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/complaint-types/${id}`, undefined, token);
  }

  @Patch('appointments/complaint-types/:id')
  updateComplaintType(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/complaint-types/${id}`, body, token);
  }

  @Delete('appointments/complaint-types/:id')
  deleteComplaintType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/complaint-types/${id}`, undefined, token);
  }

  @Post('appointments/action-types')
  createActionType(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/action-types', body, token);
  }

  @Get('appointments/action-types')
  findActionTypes(@Query('onlyActive') onlyActive?: string, @Headers('authorization') token?: string) {
    const path = onlyActive
      ? `/sam/appointments/action-types?onlyActive=${encodeURIComponent(onlyActive)}`
      : '/sam/appointments/action-types';
    return this.proxyService.appointments('get', path, undefined, token);
  }

  @Get('appointments/action-types/:id')
  findOneActionType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/action-types/${id}`, undefined, token);
  }

  @Patch('appointments/action-types/:id')
  updateActionType(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/action-types/${id}`, body, token);
  }

  @Delete('appointments/action-types/:id')
  deleteActionType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/action-types/${id}`, undefined, token);
  }

  @Post('appointments/courses')
  createCourse(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/courses', body, token);
  }

  @Get('appointments/courses')
  findCourses(
    @Query('courseTypeId') courseTypeId?: string,
    @Query('courseType') courseType?: string,
    @Headers('authorization') token?: string,
  ) {
    const query = new URLSearchParams();
    if (courseTypeId) query.append('courseTypeId', courseTypeId);
    if (courseType) query.append('courseType', courseType);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.proxyService.appointments('get', `/sam/appointments/courses${queryString}`, undefined, token);
  }

  @Get('appointments/courses/:id')
  findOneCourse(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/courses/${id}`, undefined, token);
  }

  @Patch('appointments/courses/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/courses/${id}`, body, token);
  }

  @Delete('appointments/courses/:id')
  deleteCourse(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/courses/${id}`, undefined, token);
  }

  @Post('appointments/units')
  createUnit(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/units', body, token);
  }

  @Get('appointments/units')
  findUnits(@Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', '/sam/appointments/units', undefined, token);
  }

  @Get('appointments/units/:id')
  findOneUnit(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/units/${id}`, undefined, token);
  }

  @Patch('appointments/units/:id')
  updateUnit(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/units/${id}`, body, token);
  }

  @Delete('appointments/units/:id')
  deleteUnit(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/units/${id}`, undefined, token);
  }

  @Post('appointments/course-types')
  createCourseType(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/course-types', body, token);
  }

  @Get('appointments/course-types')
  findCourseTypes(@Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', '/sam/appointments/course-types', undefined, token);
  }

  @Get('appointments/course-types/:id')
  findOneCourseType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/course-types/${id}`, undefined, token);
  }

  @Patch('appointments/course-types/:id')
  updateCourseType(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/course-types/${id}`, body, token);
  }

  @Delete('appointments/course-types/:id')
  deleteCourseType(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/course-types/${id}`, undefined, token);
  }

  @Post('appointments/course-modalities')
  createCourseModality(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/course-modalities', body, token);
  }

  @Get('appointments/course-modalities')
  findCourseModalities(@Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', '/sam/appointments/course-modalities', undefined, token);
  }

  @Get('appointments/course-modalities/:id')
  findOneCourseModality(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/course-modalities/${id}`, undefined, token);
  }

  @Patch('appointments/course-modalities/:id')
  updateCourseModality(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/course-modalities/${id}`, body, token);
  }

  @Delete('appointments/course-modalities/:id')
  deleteCourseModality(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/course-modalities/${id}`, undefined, token);
  }


  @Post('appointments/collective-interventions')
  createCollectiveIntervention(@Body() body: unknown, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('post', '/sam/appointments/collective-interventions', body, token);
  }

  @Get('appointments/collective-interventions')
  findCollectiveInterventions(@Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', '/sam/appointments/collective-interventions', undefined, token);
  }

  @Get('appointments/collective-interventions/:id/public')
  getPublicCollectiveIntervention(@Param('id') id: string) {
    return this.proxyService.appointments('get', `/sam/appointments/collective-interventions/${id}/public`);
  }

  @Post('appointments/collective-interventions/:id/checkin')
  checkinCollectiveIntervention(@Param('id') id: string, @Body() body: unknown) {
    return this.proxyService.appointments('post', `/sam/appointments/collective-interventions/${id}/checkin`, body);
  }

  @Get('appointments/collective-interventions/:id/attendees')
  getCollectiveInterventionAttendees(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/collective-interventions/${id}/attendees`, undefined, token);
  }

  @Get('appointments/collective-interventions/:id')
  findOneCollectiveIntervention(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('get', `/sam/appointments/collective-interventions/${id}`, undefined, token);
  }

  @Patch('appointments/collective-interventions/:id')
  updateCollectiveIntervention(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    return this.proxyService.appointments('patch', `/sam/appointments/collective-interventions/${id}`, body, token);
  }

  @Delete('appointments/collective-interventions/:id')
  deleteCollectiveIntervention(@Param('id') id: string, @Headers('authorization') token?: string) {
    return this.proxyService.appointments('delete', `/sam/appointments/collective-interventions/${id}`, undefined, token);
  }

  @Post('appointments/dossiers/:dossierId/records')
  createRecord(
    @Param('dossierId') dossierId: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    if (role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'post',
      `/sam/appointments/dossiers/${dossierId}/records`,
      body,
      token,
    );
  }

  @Get('appointments/dossiers/:dossierId/records')
  async findRecordsByDossier(
    @Param('dossierId') dossierId: string,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    const records = await this.proxyService.appointments<any[]>(
      'get',
      `/sam/appointments/dossiers/${dossierId}/records`,
      undefined,
      token,
    );
    return records.filter((r) => this.hasPermissionToRecord(role, r.visibility));
  }

  @Get('appointments/records/:id')
  async findOneRecord(
    @Param('id') id: string,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    const record = await this.proxyService.appointments<any>(
      'get',
      `/sam/appointments/records/${id}`,
      undefined,
      token,
    );
    if (!this.hasPermissionToRecord(role, record.visibility)) {
      throw new ForbiddenException('Acesso negado a este registro de dossiê');
    }
    return record;
  }

  private getRoleFromToken(token?: string): string {
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }
    try {
      const parts = token.split(' ');
      const jwt = parts[parts.length - 1];
      const payloadBase64 = jwt.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadJson);
      if (!payload.role) {
        throw new ForbiddenException('Perfil de acesso inválido');
      }
      return payload.role;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private hasPermissionToRecord(role: string, visibility: string): boolean {
    return role === 'PSICOLOGA_EDUCACIONAL';
  }

  @Patch('appointments/records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') token?: string,
  ) {
    const role = this.getRoleFromToken(token);
    if (role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
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
    const role = this.getRoleFromToken(token);
    if (role !== 'PSICOLOGA_EDUCACIONAL') {
      throw new ForbiddenException('Acesso negado');
    }
    return this.proxyService.appointments(
      'delete',
      `/sam/appointments/records/${id}`,
      undefined,
      token,
    );
  }
}

