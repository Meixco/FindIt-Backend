import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { DeleteKategori, TambahKategori, UpdateKategori } from './categories.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly serviceCategories: CategoriesService) {}

  @Post('create')
  async create(@Body() buatkategori: TambahKategori) {
    return this.serviceCategories.create(buatkategori);
  }

  @Get('findAll')
  async findAll() {
    return this.serviceCategories.findAll();
  }

  @Get('find/:id')
  async findOne(@Param('id') id: number) {
    return this.serviceCategories.findOne(id);
  }

  @Patch('update/:id')
  async updateKategori(@Param('id') id: number, @Body() updateKategori: UpdateKategori) {
    return this.serviceCategories.update(id, updateKategori)
  }

  @Delete('delete/:id')
  async deleteKategori(@Param('id') id: number) {
    return this.serviceCategories.delete(id)
  }
}
