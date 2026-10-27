import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './categories.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule, CategoriesService]
})
export class CategoriesModule {}
