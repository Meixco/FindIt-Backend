import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AdminRole } from '../entities/admin.entity.js';
import type { AuthenticatedAdmin } from './current-admin.decorator.js';

export const ROLES_KEY = 'roles';

/** Pemakaian: @Roles(AdminRole.SUPER_ADMIN), selalu setelah JwtAuthGuard. */
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedAdmin }>();
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Akses ditolak');
    }
    return true;
  }
}