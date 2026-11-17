import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AdminRole } from '../entities/admin.entity.js';

/** Data admin yang dipasang guard pada request (req.user). */
export interface AuthenticatedAdmin {
  id: number;
  username_or_email: string;
  role: AdminRole;
  jti: string;
  exp: number;
}

/** Pemakaian: method(@CurrentAdmin() admin: AuthenticatedAdmin) */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin =>
    ctx.switchToHttp().getRequest().user,
);
