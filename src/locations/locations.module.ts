import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller.js';
import { LocationsService } from './locations.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locations } from '../entities/locations.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Locations])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [TypeOrmModule, LocationsService]
})
export class LocationsModule {}
