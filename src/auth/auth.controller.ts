import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CurrentAdmin } from './current-admin.decorator.js';
import type { AuthenticatedAdmin } from './current-admin.decorator.js';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Publik, tetapi dibatasi 5 percobaan per menit per IP (anti tebak password).
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentAdmin() admin: AuthenticatedAdmin) {
    await this.auth.logout(admin.jti, admin.exp);
    return { message: 'Berhasil logout' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return {
      id: admin.id,
      username_or_email: admin.username_or_email,
      role: admin.role,
    };
  }
}
