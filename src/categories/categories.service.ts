import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './categories.entity.js';
import { Repository } from 'typeorm';
import { TambahKategori, UpdateKategori } from './categories.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create(TambahKategori: TambahKategori) {
    const DataKategori = this.categoriesRepository.create(TambahKategori);
    const simpanKategori = await this.categoriesRepository.save(DataKategori);
    return {
      statusCode: 201,
      message: 'Sukses',
      data: simpanKategori,
    };
  }

  async findAll() {
    const DataKategori = await this.categoriesRepository.find();

    if (!DataKategori) {
      throw new NotFoundException(`Kategori Ini Masih Belum Dibuatkan`);
    }

    return {
      status: 200,
      message: 'Sukses',
      data: DataKategori,
    };
  }

  async findOne(id: number) {
    const DataID = await this.categoriesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!DataID) {
      throw new NotFoundException('Pilihan Tidak Ada Di Database');
    }

    return {
      status: 200,
      message: 'sukses',
      data: DataID,
    };
  }

  async update(id: number, updateKategori: UpdateKategori) {
    const idKategori = await this.categoriesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!idKategori) {
      throw new NotFoundException('Maaf, Sepertinya Kategori Ini Belum Dibuat');
    }

    const updateData = await this.categoriesRepository.update(
      {
        id: id,
      },
      updateKategori
    );

    return {
      status: 200,
      message: "Sukses",
      data: updateData
    };
  }

  async delete (id: number) {
    const idKategori = await this.categoriesRepository.findOne({
      where: {
        id: id
      }
    })

    if (!idKategori) {
      throw new NotFoundException("Maaf, Sepertinya Kategori Belum Dibuat")
    }

    const deleteData = await this.categoriesRepository.delete({
      id: id
    })

    return {
      status: 200,
      message: "Sukses",
      data: deleteData
    }
  }
}
