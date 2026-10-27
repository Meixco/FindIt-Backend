import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports/reports.controller.js';
import { ReportsService } from './reports/reports.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { Categories } from './categories/categories.entity.js';
import { ReportsModule } from './reports/reports.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { Locations } from './entities/locations.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password:'',
      database: 'findit',
      entities: [Categories, Locations],
      synchronize: true
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'finditgunadarma',
    }),
    ReportsModule,
    CategoriesModule,
    LocationsModule,
  ],
  controllers: [AppController, ReportsController],
  providers: [AppService, ReportsService],
})
export class AppModule {}
