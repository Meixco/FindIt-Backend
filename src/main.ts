import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  app.enableCors({origin: process.env.FRONTEND_URL?.split(',') ?? false})
  app.useStaticAssets(resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads'), {
    prefix: '/uploads',
    index: false,
    dotfiles: 'deny',
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');

      res.setHeader('Content-Security-Policy', "default-src 'none'")

      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    }
  })
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
