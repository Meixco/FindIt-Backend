import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../entities/admin.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
