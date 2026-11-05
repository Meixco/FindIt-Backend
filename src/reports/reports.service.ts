import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { DtoLaporan, ListReportsDto, UpdateDto } from '../dto/reports.dto.js';
import { Categories } from '../entities/categories.entity.js';
import { Locations } from '../entities/locations.entity.js';
import { Reports } from '../entities/reports.entity.js';
import { dateRange, escapeLike, getSkip, toPaginated } from '../utills/pagination.utills.js';

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

  async findAll(query: ListReportsDto) {
    const {page, limit, order, sort_by, search, report_type, category_id, location_id, status, date_from, date_to} = query;

    const base: FindOptionsWhere<Reports> = {};
    if (report_type) base.report_type = report_type;
    if (status) base.status = status as any;
    if (category_id) base.categories = { id: category_id };
    if (location_id) base.locations = { id: location_id };

    const range = dateRange(date_from, date_to);
    if (range) base.event_date = range as any;

    const where: FindOptionsWhere<Reports> | FindOptionsWhere<Reports>[] =
      search
      ? [
        {...base, item_name: Like(`%${escapeLike(search)}%`)},
        {...base, description_public: Like(`%${escapeLike(search)}%`)}
      ] : base

      const orderBy = { [sort_by]: order, id: 'DESC' } as FindOptionsOrder<Reports>;

    const [data, total] = await this.repoLaporan.findAndCount({
      where,
      relations: {categories: true, locations: true},
      order: orderBy,
      skip: getSkip(page, limit),
      take: limit
    });

    return toPaginated(data, total, page, limit);
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
