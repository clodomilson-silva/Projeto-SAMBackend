import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { UserAuthPayload } from './interfaces/user-auth.interface';

interface ValidateRotateResponse {
  id: string;
  userId: string;
  expiresAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

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

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
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

    const accessToken = this.jwtService.sign(tokenPayload);
    const refreshToken = this.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Persist session in sam-user-service
    await firstValueFrom(
      this.httpService.post(`${this.userServiceUrl}/sam/users/internal/sessions`, {
        userId: user.id,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt: expiresAt.toISOString(),
      }),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const newRefreshToken = this.generateRefreshToken();
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    try {
      const response = await firstValueFrom(
        this.httpService.post<ValidateRotateResponse>(
          `${this.userServiceUrl}/sam/users/internal/sessions/validate`,
          {
            userId,
            refreshToken,
            newRefreshToken,
            newExpiresAt: newExpiresAt.toISOString(),
          },
        ),
      );

      const rotatedSession = response.data;
      const user = rotatedSession.user;

      const tokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const accessToken = this.jwtService.sign(tokenPayload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }
  }

  async logout(userId: string, refreshToken: string) {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.userServiceUrl}/sam/users/internal/sessions/revoke`,
          {
            userId,
            refreshToken,
          },
        ),
      );
      return { message: 'Desconectado com sucesso' };
    } catch {
      return { message: 'Erro ao revogar sessão' };
    }
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