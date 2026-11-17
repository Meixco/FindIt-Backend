import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service.js';
import { TambahLokasi, UpdateLokasi } from '../dto/locations.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('locations')
export class LocationsController {
  constructor(private readonly servisLokasi: LocationsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() buatLokasi: TambahLokasi) {
    return this.servisLokasi.create(buatLokasi);
  }

  @Get('findAll')
  async temukanSemua() {
    return this.servisLokasi.findAll()
  }

  @Get("findOne/:id")
  async temukanSatuData (@Param("id") id: number) {
    return this.servisLokasi.findOne(id)
  }

  @Put("update/:id")
  @UseGuards(JwtAuthGuard)
  async updateData (@Param("id") id: number, @Body() dtoUpdate: UpdateLokasi) {
    return this.servisLokasi.update(id, dtoUpdate)
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  async hapusData(@Param("id") id: number) {
    return this.servisLokasi.delete(id)
  }
}
