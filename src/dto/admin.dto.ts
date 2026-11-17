import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AdminRole } from '../entities/admin.entity.js';

export class CreateAdminDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username_or_email: string;

  @IsString()
  @MinLength(12, { message: 'Password minimal 12 karakter' })
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
