import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { DtoLaporan, UpdateDto } from '../dto/reports.dto.js';

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

@Get("/findOne/:id")
async findOne(@Param("id") id: string) {
  return this.laporanService.findOne(id)
}

@Patch("/update/:id")
async update(@Param("id") id: string, @Body() updateDto: UpdateDto) {
  return this.laporanService.update(id, updateDto)
}

@Delete("/delete/:id")
async delete(@Param("id") id: string) {
  return this.laporanService.delete(id)
}

}
