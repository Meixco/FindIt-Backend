import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from '../entities/reports.entity.js';
import { LocationsModule } from '../locations/locations.module.js';
import { CategoriesModule } from '../categories/categories.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reports]),
    LocationsModule,
    CategoriesModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
