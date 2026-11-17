import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles, RolesGuard } from '../auth/roles.guard.js';
import { CurrentAdmin } from '../auth/current-admin.decorator.js';
import type { AuthenticatedAdmin } from '../auth/current-admin.decorator.js';
import { AdminRole } from '../entities/admin.entity.js';
import { AdminService } from './admin.service.js';
import { CreateAdminDto } from '../dto/admin.dto.js';

// ADMIN ONLY, dan hanya super_admin yang boleh mengelola akun admin.
@Controller('admin/admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.service.create(dto);
  }

  @Patch(':id/deactivate')
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    return this.service.deactivate(id, admin.id);
  }
}