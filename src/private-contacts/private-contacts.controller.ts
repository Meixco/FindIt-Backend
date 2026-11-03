import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { PrivateContactsService } from './private-contacts.service.js';
import { DTOContact, updateContact } from '../dto/privateContact.dto.js';

@Controller('private-contacts')
export class PrivateContactsController {
    constructor(private readonly servisKontak: PrivateContactsService) {}

@Post("/create")
async create (@Body() kontakDto: DTOContact) {
    return this.servisKontak.create(kontakDto)
}

@Patch("/update/:id")
async update(@Param("id") id: number, @Body() perbaruiDto :updateContact) {
    return this.servisKontak.update(id, perbaruiDto)
}
}
