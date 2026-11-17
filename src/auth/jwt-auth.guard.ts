import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthenticatedAdmin } from './current-admin.decorator.js';

/**
 * Pemakaian: @UseGuards(JwtAuthGuard) di atas class controller admin.
 * Membaca header "Authorization: Bearer <token>".
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: AuthenticatedAdmin;
    }>();

    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    req.user = await this.auth.verifyAccessToken(token);
    return true;
  }
}