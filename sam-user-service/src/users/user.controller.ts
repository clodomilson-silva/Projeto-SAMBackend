import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('sam/users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
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

  @Post('request-reset')
  requestReset(@Body('email') email: string) {
    return this.service.requestReset(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body() body: { email: string; newPassword: string },
  ) {
    return this.service.resetPasswordByUser(body);
  }

  @Get('internal/by-email/:email')
  findByEmailForAuth(@Param('email') email: string) {
    return this.service.findByEmailForAuth(email);
  }

  @Patch(':id/authorize')
  toggleAuthorize(@Param('id') id: string) {
    return this.service.toggleAuthorize(id);
  }

  @Post(':id/reset-password')
  adminResetPassword(@Param('id') id: string) {
    return this.service.adminResetPassword(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}