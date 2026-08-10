import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('sam/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto, @Req() req: any) {
    const ipAddress = req.ip || req.headers?.['x-forwarded-for']?.toString();
    const userAgent = req.headers?.['user-agent'];
    return this.authService.login(body.email, body.password, ipAddress, userAgent);
  }

  @Post('refresh')
  refresh(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('request-reset')
  requestReset(@Body('email') email: string) {
    return this.authService.requestReset(email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }

  @Post('logout')
  logout(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.logout(userId, refreshToken);
  }
}