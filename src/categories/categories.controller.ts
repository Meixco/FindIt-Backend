import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { TambahKategori } from './categories.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly serviceCategories: CategoriesService) {}

@Post("create")
async create(@Body() buatkategori: TambahKategori) {
    return this.serviceCategories.create(buatkategori);
}
}
