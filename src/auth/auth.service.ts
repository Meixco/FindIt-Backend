import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { LessThan, Repository } from 'typeorm';
import { AdminService } from '../admin/admin.service.js';
import type { AdminRole } from '../entities/admin.entity.js'
import { verifyPassword } from '../utills/password.utills.js';
import { LoginDto } from '../dto/login.dto.js';
import { RevokedToken } from './revoked-token.entity.js';
import type { AuthenticatedAdmin } from './current-admin.decorator.js';

interface AccessTokenPayload {
  sub: string;
  role: AdminRole;
  jti: string;
  iat: number;
  exp: number;
}

// Pesan sama untuk semua kegagalan login agar akun tidak bisa ditebak.
const LOGIN_FAILED = 'Username/email atau password salah';
const TOKEN_INVALID = 'Token tidak valid atau sudah kedaluwarsa';

@Injectable()
export class AuthService {
  constructor(
    private readonly admins: AdminService,
    private readonly jwt: JwtService,
    @InjectRepository(RevokedToken)
    private readonly revoked: Repository<RevokedToken>,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.admins.findForLogin(dto.username_or_email);

    // Selalu verifikasi (termasuk hashing palsu jika akun tidak ada).
    const passwordOk = await verifyPassword(dto.password, admin?.auth_reference);
    if (!admin || !admin.is_active || !passwordOk) {
      throw new UnauthorizedException(LOGIN_FAILED);
    }

    const access_token = await this.jwt.signAsync(
      { role: admin.role },
      { subject: String(admin.id), jwtid: randomUUID() },
    );
    const { iat, exp } = this.jwt.decode<{ iat: number; exp: number }>(access_token);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: exp - iat, // detik
      expires_at: new Date(exp * 1000).toISOString(),
      admin: {
        id: admin.id,
        username_or_email: admin.username_or_email,
        role: admin.role,
      },
    };
  }

  /** Dipanggil oleh JwtAuthGuard di setiap request admin. */
  async verifyAccessToken(token: string): Promise<AuthenticatedAdmin> {
    let payload: AccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException(TOKEN_INVALID);
    }

    if (!payload.jti || (await this.revoked.countBy({ jti: payload.jti })) > 0) {
      throw new UnauthorizedException(TOKEN_INVALID);
    }

    // Cek ke database agar admin yang dinonaktifkan langsung kehilangan akses.
    const admin = await this.admins.findById(Number(payload.sub));
    if (!admin || !admin.is_active) {
      throw new UnauthorizedException(TOKEN_INVALID);
    }

    return {
      id: admin.id,
      username_or_email: admin.username_or_email,
      role: admin.role,
      jti: payload.jti,
      exp: payload.exp,
    };
  }

  async logout(jti: string, exp: number) {
    await this.revoked.upsert(
      { jti, expires_at: new Date(exp * 1000) },
      ['jti'],
    );
    // Bersihkan catatan token yang memang sudah kedaluwarsa.
    await this.revoked.delete({ expires_at: LessThan(new Date()) });
  }
}