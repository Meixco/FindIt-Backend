import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateContact } from '../entities/privateContact.entity.js';
import { Repository } from 'typeorm';
import { DTOContact, updateContact } from '../dto/privateContact.dto.js';
import { Reports } from '../entities/reports.entity.js';


@Injectable()
export class PrivateContactsService {
  constructor(
    @InjectRepository(PrivateContact)
    private readonly repoKontak: Repository<PrivateContact>,
    @InjectRepository(Reports)
    private readonly repoLaporan: Repository<Reports>
  ) {}

  async create(dtoKontak: DTOContact) {
    const { reportId, ...dataKontak } = dtoKontak;

    const report = await this.repoLaporan.findOne({
        where: {
            id: reportId
        }
    })

    if (!report) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Laporan Pengguna")
    }

    const kontakBaru = this.repoKontak.create({
        ...dataKontak,
        reports: report
    })

    const dataSimpanan = await this.repoKontak.save(kontakBaru)

    return {
        status: 201,
        message: "Sukses",
        data: dataSimpanan
    }
  }

  async findByOne (id: number) {
    const idKontak = await this.repoKontak.findOne({
        where: {
            id: id
        },
        relations: {
            reports: true
        }
    })

    if (!idKontak) {
        throw new NotFoundException("Maaf, Kontak Anda Tidak Ada")
    }

    return {
        status: 200,
        message: "Sukses",
        data: idKontak
    }
  }

  async update (id: number, dtoUpdate: updateContact) {
    const idPerbarui = await this.repoKontak.findOne({
        where: {
            id: id
        }
    })
    
    if (!idPerbarui) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Kontak Anda")
    }

    const {reportId, ...perbaruiKontak} = dtoUpdate

    const idLaporan = await this.repoLaporan.findOne({
        where: {
            id: reportId
        }
    })

    if(!idLaporan) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Laporan Pengguna")
    }

    Object.assign(idPerbarui, perbaruiKontak)

    const perbarui = await this.repoKontak.save(idPerbarui);

    return {
        status: 200,
        message: "Sukses",
        data: perbarui
    }
  }

  async delete (id: number)  {
    const idKontak = await this.repoKontak.findOne({
        where: {
            id: id
        },
        relations: {
            reports: true
        }
    })

    if (!idKontak) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Kontak Anda")
    }

    await this.repoKontak.delete(idKontak)

    return {
        status: 200,
        message: "Success",
        data: idKontak
    }
  }
}
