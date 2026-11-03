import { Module } from '@nestjs/common';
import { PrivateContactsController } from './private-contacts.controller.js';
import { PrivateContactsService } from './private-contacts.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateContact } from '../entities/privateContact.entity.js';
import { ReportsModule } from '../reports/reports.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateContact]),
    ReportsModule
],
  controllers: [PrivateContactsController],
  providers: [PrivateContactsService]
})
export class PrivateContactsModule {}
