import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ValidateSessionDto } from './dto/validate-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSessionDto) {
    // Revoga todas as sessões ativas anteriores deste usuário para garantir login único por perfil
    await this.revokeAllForUser(data.userId);

    const refreshTokenHash = await bcrypt.hash(data.refreshToken, 10);

    return this.prisma.authSession.create({
      data: {
        userId: data.userId,
        refreshTokenHash,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        expiresAt: new Date(data.expiresAt),
      },
    });
  }

  async validateAndRotate(data: ValidateSessionDto) {
    const sessions = await this.prisma.authSession.findMany({
      where: {
        userId: data.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    let matchedSession = null;
    for (const session of sessions) {
      const isValid = await bcrypt.compare(data.refreshToken, session.refreshTokenHash);
      if (isValid) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    const newHash = await bcrypt.hash(data.newRefreshToken, 10);

    return this.prisma.authSession.update({
      where: { id: matchedSession.id },
      data: {
        refreshTokenHash: newHash,
        expiresAt: new Date(data.newExpiresAt),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async revoke(userId: string, refreshToken: string) {
    const sessions = await this.prisma.authSession.findMany({
      where: {
        userId,
        revokedAt: null,
      },
    });

    let matchedSession = null;
    for (const session of sessions) {
      const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
      if (isValid) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      return { message: 'Sessão não encontrada ou já revogada' };
    }

    await this.prisma.authSession.update({
      where: { id: matchedSession.id },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Sessão revogada com sucesso' };
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Todas as sessões do usuário foram revogadas com sucesso' };
  }
}
