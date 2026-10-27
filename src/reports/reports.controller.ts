import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { DtoLaporan } from '../dto/reports.dto.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly laporanService: ReportsService) {}
@Post("/create")
async create(@Body() laporandto: DtoLaporan) {
    return this.laporanService.create(laporandto)
}

@Get("/findAll")
async findAll() {
  return this.laporanService.findAll()
}

}
