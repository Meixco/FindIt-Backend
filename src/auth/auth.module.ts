import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AdminModule } from '../admin/admin.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedToken } from './revoked-token.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forFeature([RevokedToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        if (secret.length < 32) {
          throw new Error('JWT_SECRET minimal 32 karakter');
        }
        return {
          secret,
          signOptions: {
            algorithm: 'HS256' as const,
            // Masa berlaku token, dalam detik (default 30 menit).
            expiresIn: Number(config.get('JWT_EXPIRES_IN_SECONDS')) || 1800,
          },
          verifyOptions: { algorithms: ['HS256' as const] },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
