import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { UserAuthPayload } from './interfaces/user-auth.interface';

@Injectable()
export class AuthService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.userServiceUrl = this.configService.get<string>(
      'USER_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  async login(email: string, password: string) {
    const user = await this.fetchUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(tokenPayload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async fetchUserByEmail(email: string): Promise<UserAuthPayload | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<UserAuthPayload>(
          `${this.userServiceUrl}/sam/users/internal/by-email/${encodeURIComponent(
            email,
          )}`,
        ),
      );
      return response.data;
    } catch {
      return null;
    }
  }
}