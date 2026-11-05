import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Claims } from '../entities/claims.entity.js';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Reports } from '../entities/reports.entity.js';
import { DtoClaims, ListClaimsDto, UpdateClaimStatusDto } from '../dto/claims.dto.js';
import { dateRange, escapeLike, getSkip, toPaginated } from '../utills/pagination.utills.js';
import { maskValue } from '../utills/mask.utills.js';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claims) private readonly repoKlaim: Repository<Claims>,
    @InjectRepository(Reports)
    private readonly repoLaporan: Repository<Reports>,
  ) {}

  async create(dtoKlaim: DtoClaims) {
    const { reportId, ...buatKlaim } = dtoKlaim;

    const report = await this.repoLaporan.findOne({
      where: {
        id: reportId,
      },
    });

    if (!report) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Laporan Pengguna")
    }

    const klaimBaru = await this.repoKlaim.create({
        ...buatKlaim,
        report: report
    })

    const createKlaim = await this.repoKlaim.save(klaimBaru);

    return {
        status: 201,
        message: "Sukses",
        data: createKlaim
    }
  }

  async findAll (query: ListClaimsDto) {
    const { page, limit, order, sort_by, search, status, report_id, date_from, date_to } = query;

    const base: FindOptionsWhere<Claims> = {};
    if (status) base.status = status as any;
    if (report_id) base.report = {id: report_id} as any;

    const range = dateRange(date_from, date_to);
    if (range) base.createdAt = range as any;
    
    const where: FindOptionsWhere<Claims> = search ? {...base, claimant_name: Like(`%${escapeLike(search)}%`)} : base;

    const orderBy = { [sort_by]: order, id: 'DESC' } as FindOptionsOrder<Claims>;

    const [ rows, total ]= await this.repoKlaim.findAndCount({
      where,
      select: {
        id: true,
        claimant_name: true,
        student_number_optional: true,
        status: true,
        createdAt: true,
        reviewedAt: true
      },
      order: orderBy,
      skip: getSkip(page, limit),
      take: limit
    })

    const dataKlaim = rows.map((claim) => ({
      ...claim,
      student_number_optional: maskValue(claim.student_number_optional)
    }))
    
    return toPaginated(dataKlaim, total, page, limit)
  }

  async findOne(id: number) {
    const klaimbyId = await this.repoKlaim.findOne({
        where: {
            id: id
        }
    })

    if (!klaimbyId) {
        throw new NotFoundException("Maaf, Tidak Ditemukan Klaim Pengguna")
    }

    return {
        status: 200,
        message: "Sukses",
        data: klaimbyId
    }
  }

  async gantiStatus (id: number, updateDto: UpdateClaimStatusDto) {
    const cariID = await this.repoKlaim.findOne({
      where: {
        id: id
      }
    });

    if (!cariID) {
      throw new NotFoundException("Maaf, Tidak Ditemukan Klaim Pengguna")
    }

    const perbarui = await this.repoKlaim.update(id,{
      status: updateDto.status,
    })

    return {
      status: 200,
      message: "Sukses",
      data: cariID
    }
  }
}
