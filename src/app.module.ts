import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports/reports.controller.js';
import { ReportsService } from './reports/reports.service.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { Reports } from './entities/reports.entity.js';
import { Locations } from './entities/locations.entity.js';
import { Categories } from './categories/categories.entity.js';

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
      entities: [Locations, Categories, Reports],
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
