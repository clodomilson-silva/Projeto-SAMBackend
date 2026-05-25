import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { ValidateSessionDto } from './dto/validate-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sam/users/internal/sessions')
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Post()
  create(@Body() body: CreateSessionDto) {
    return this.service.create(body);
  }

  @Post('validate')
  validateAndRotate(@Body() body: ValidateSessionDto) {
    return this.service.validateAndRotate(body);
  }

  @Post('revoke')
  revoke(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.service.revoke(userId, refreshToken);
  }

  @Post('revoke-all/:userId')
  revokeAllForUser(@Param('userId') userId: string) {
    return this.service.revokeAllForUser(userId);
  }
}
