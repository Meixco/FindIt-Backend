import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locations } from '../entities/locations.entity.js';
import { Repository } from 'typeorm';
import { TambahLokasi, UpdateLokasi } from '../dto/locations.dto.js';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Locations)
    private readonly locationRepository: Repository<Locations>,
  ) {}

  async create(createLokasi: TambahLokasi) {
    const DataLokasi = this.locationRepository.create(createLokasi);

    const tambah = await this.locationRepository.save(DataLokasi);

    return {
      status: 201,
      message: 'Sukses',
      data: tambah,
    };
  }

  async findAll() {
    const temukanSemua = await this.locationRepository.find();

    if (!temukanSemua) {
      throw new NotFoundException('Sepertinya Lokasi Belum Dibuat');
    }

    return {
      status: 200,
      message: 'Sukses',
      data: temukanSemua,
    };
  }

  async findOne(id: number) {
    const temukanId = await this.locationRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!temukanId) {
      throw new NotFoundException('Sepertinya Lokasi Ini Belum Dibuat');
    }

    return {
      status: 200,
      message: 'Sukses',
      data: temukanId,
    };
  }

  async update(id: number, perbaruiLokasi: UpdateLokasi) {
    const idLokasi = await this.locationRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!idLokasi) {
      throw new NotFoundException('Sepertinya Lokasi Belum Dibuat');
    }

    const dataUpdate = await this.locationRepository.update(
      {
        id: id,
      },
      perbaruiLokasi,
    );

    return {
        status: 200,
        message: "Sukses",
        data: dataUpdate
    }
  }

  async delete (id: number) {
    const idNumber = await this.locationRepository.findOne({
        where: {
            id: id
        }
    })

    if(!idNumber) {
        throw new NotFoundException("Sepertinya Lokasi Belum Dibuat")
    }

    const hapus = await this.locationRepository.delete({
        id: id
    })

    return {
        status: 200,
        message: "Sukses",
        data: hapus
    }
  }
}
