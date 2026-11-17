import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PrivateContactsService } from './private-contacts.service.js';
import { DTOContact, updateContact } from '../dto/privateContact.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('private-contacts')
export class PrivateContactsController {
  constructor(private readonly servisKontak: PrivateContactsService) {}

  @Post('/create')
  async create(@Body() kontakDto: DTOContact) {
    return this.servisKontak.create(kontakDto);
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() perbaruiDto: updateContact) {
    return this.servisKontak.update(id, perbaruiDto);
  }
}

// Khusus Admin
@Controller('/admin/private-contacts')
@UseGuards(JwtAuthGuard)
export class AdminPrivateContactsController {
  constructor(
    private readonly servisKontakuntukAdmin: PrivateContactsService,
  ) {}
  @Get('/find/:id')
  async findOnebyAdmin(@Param('id') id: number) {
    return this.servisKontakuntukAdmin.findByOne(id);
  }
  @Delete('/delete/:id')
  async deletebyAdmin(@Param('id') id: number) {
    return this.servisKontakuntukAdmin.delete(id);
  }
}
