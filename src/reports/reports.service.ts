import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { DtoLaporan, UpdateDto } from '../dto/reports.dto.js';
import { Categories } from '../categories/categories.entity.js';
import { Locations } from '../entities/locations.entity.js';
import { Reports } from '../entities/reports.entity.js';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Categories)
    private readonly repoKategori: Repository<Categories>,
    @InjectRepository(Locations)
    private readonly repoLokasi: Repository<Locations>,
    @InjectRepository(Reports)
    private readonly repoLaporan: Repository<Reports>,
  ) {}

  private async generateCustomId(): Promise<string> {
    const prefix = 'FIND-26';

    const lastReport = await this.repoLaporan
      .createQueryBuilder('reports')
      .where('reports')
      .where('reports.id LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('reports.id', 'DESC')
      .getOne();

    if (!lastReport) {
      return `${prefix}001`;
    }

    const lastNumberString = lastReport.id.replace(prefix, '');
    const nextNumber = parseInt(lastNumberString, 10) + 1;
    const formattedNumber = String(nextNumber).padStart(3, '0');

    return `${prefix}${formattedNumber}`;
  }

  async create(dtoLaporan: DtoLaporan) {
    const customId = await this.generateCustomId();
    const { categoryId, locationId, ...reportData } = dtoLaporan;

    const kategori = await this.repoKategori.findOne({
      where: {
        id: categoryId,
      },
    });

    const lokasi = await this.repoLokasi.findOne({
      where: {
        id: locationId,
      },
    });

    if (!kategori) {
      throw new NotFoundException(
        'Sepertinya Tidak Menemukan Kategori Yang Sesuai',
      );
    }

    if (!lokasi) {
      throw new NotFoundException(
        'Sepertinya Tidak Menemukan Lokasi Yang Dicar',
      );
    }

    const laporanBaru = this.repoLaporan.create({
      id: customId,
      ...reportData,
      categories: kategori,
      locations: lokasi,
    });

    this.repoLaporan.save(laporanBaru);

    return {
      status: 201,
      message: 'Sukses',
      data: laporanBaru,
    };
  }

  async findAll() {
    const cariSemuaLaporan = await this.repoLaporan.find({
      relations: {
        categories: true,
        locations: true,
      },
    });

    if (!cariSemuaLaporan) {
      throw new NotFoundException('Sepertinya Belum Ada Laporan Yang Dibuat');
    }

    return {
      status: 200,
      message: 'sukses',
      data: cariSemuaLaporan,
    };
  }

  async findOne(id: string) {
    const cariID = await this.repoLaporan.findOne({
      where: {
        id: id,
      },
      relations: {
        categories: true,
        locations: true,
      },
    });

    if (!cariID) {
      throw new NotFoundException(
        'Sepertinya Belum Dibuat Laporan Oleh Salah Satu Pelapor',
      );
    }

    return {
      status: 200,
      message: 'Sukses',
      data: cariID,
    };
  }

  async update(id: string, updateLaporan: UpdateDto) {
    const cariID = await this.repoLaporan.findOne({
      where: {
        id: id,
      },
    });

    const {locationId, categoryId, ...updateDataLaporan} = updateLaporan;

    const cariLokasi = await this.repoLokasi.findOne({
      where: {
        id: locationId
      }
    });

    const cariKategori = await this.repoKategori.findOne({
      where: {
        id: categoryId
      }
    })

    if (!cariKategori) {
      throw new NotFoundException("Tidak Ditemukan Kategori")
    }

    if(!cariLokasi) {
      throw new NotFoundException("Tidak Ada Lokasi Ditemukan")
    }

    if (!cariID) {
      throw new NotFoundException("Sepertinya Laporan Tidak Ditemukan")
    }

    Object.assign(cariID, updateDataLaporan)

    const UpdateData = await this.repoLaporan.save(cariID);

    return {
      status: 200,
      message: "Sukses",
      data: UpdateData
    }
  }

async delete (id: string) {
  const tampilkanID = await this.repoLaporan.findOne({
    where: {
      id: id
    },
    relations: {
      categories: true,
      locations: true
    }
  })

  if (!tampilkanID) {
    throw new NotFoundException("Sepertinya Laporan Belum Di Buat")
  }

  await this.repoLaporan.delete({
    id: id
  })

  return {
    status: 200,
    message: "success",
    data: tampilkanID
  }
}
}
