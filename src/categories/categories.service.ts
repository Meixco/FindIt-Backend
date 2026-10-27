import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './categories.entity.js';
import { Repository } from 'typeorm';
import { TambahKategori } from './categories.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create (TambahKategori: TambahKategori) {
    const DataKategori = await this.categoriesRepository.create(
        TambahKategori
    );
    const simpanKategori =  this.categoriesRepository.save(DataKategori)
    return {
        statusCode: 201,
        message: "Sukses",
        data: simpanKategori
    }
  }
}
