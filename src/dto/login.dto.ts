import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username_or_email: string;

  // Batas atas mencegah request password raksasa yang membebani hashing.
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password: string;
}
