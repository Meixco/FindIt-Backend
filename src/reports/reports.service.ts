import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from '../entities/reports.entity.js';
import { Repository } from 'typeorm';
import { DtoLaporan } from '../dto/reports.dto.js';
import { Categories } from '../categories/categories.entity.js';
import { Locations } from '../entities/locations.entity.js';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Reports) private readonly repolaporan: Repository<Reports>,
        @InjectRepository(Categories) private readonly repoKategori: Repository<Categories>,
        @InjectRepository(Locations) private readonly repoLokasi: Repository<Locations>

) {}

private async generateCustomId(): Promise<string> {
    const prefix = 'FIND-26'

    const lastReport = await this.repolaporan.createQueryBuilder('reports').where('reports').where('reports.id LIKE :prefix', { prefix: `${prefix}%` }).orderBy('reports.id', 'DESC').getOne();

    if (!lastReport) {
        return `${prefix}001`
    }

    const lastNumberString = lastReport.id.replace(prefix, '')
    const nextNumber = parseInt(lastNumberString, 10) + 1;
    const formattedNumber = String(nextNumber).padStart(3, '0')

    return `${prefix}${formattedNumber}`
}

async create (dtoLaporan: DtoLaporan) {
    const customId = await this.generateCustomId();
    const {categoryId, locationId, ...reportData} = dtoLaporan;
    
    
}
}
