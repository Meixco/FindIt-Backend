import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service.js';
import { AdminClaimsController, ClaimsController } from './claims.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsModule } from '../reports/reports.module.js';
import { Claims } from '../entities/claims.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claims]),
    ReportsModule
  ],
  providers: [ClaimsService],
  controllers: [ClaimsController, AdminClaimsController]
})
export class ClaimsModule {}
