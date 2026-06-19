import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import type { AuthResponse, AuthTokens, PublicUser } from '@tasiki/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './jwt.strategy';

interface RefreshPayload extends JwtPayload {
  jti: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(email: string, password: string): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });
    const tokens = await this.issueTokens(user.id, user.email);
    return { ...tokens, user: this.toPublicUser(user) };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user.id, user.email);
    return { ...tokens, user: this.toPublicUser(user) };
  }

  /** Verify a refresh token, rotate it, and return a fresh token pair. */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: RefreshPayload;
    try {
      payload = await this.jwt.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
    });
    if (
      !stored ||
      stored.revoked ||
      stored.expiresAt < new Date() ||
      !(await bcrypt.compare(refreshToken, stored.tokenHash))
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotate: revoke the used token, then issue a new pair.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });
    return this.issueTokens(payload.sub, payload.email);
  }

  /** Revoke a refresh token (best-effort — unknown tokens are ignored). */
  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwt.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      await this.prisma.refreshToken.updateMany({
        where: { id: payload.jti, revoked: false },
        data: { revoked: true },
      });
    } catch {
      // Token already invalid — nothing to revoke.
    }
  }

  private async issueTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const accessToken = await this.jwt.signAsync({ sub: userId, email }, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_TTL'),
    } as JwtSignOptions);

    const jti = randomUUID();
    const refreshToken = await this.jwt.signAsync({ sub: userId, email, jti }, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_TTL'),
    } as JwtSignOptions);

    await this.prisma.refreshToken.create({
      data: {
        id: jti,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        userId,
        expiresAt: this.refreshExpiry(),
      },
    });

    return { accessToken, refreshToken };
  }

  private refreshExpiry(): Date {
    // Mirror JWT_REFRESH_TTL (e.g. "7d") as a concrete DB expiry.
    const ttl = this.config.getOrThrow<string>('JWT_REFRESH_TTL');
    const match = /^(\d+)([smhd])$/.exec(ttl);
    const units: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    const ms = match ? Number(match[1]) * units[match[2]] : 7 * 86_400_000;
    return new Date(Date.now() + ms);
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    createdAt: Date;
  }): PublicUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
