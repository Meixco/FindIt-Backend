import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { DtoLaporan, ListReportsDto, UpdateDto } from '../dto/reports.dto.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly laporanService: ReportsService) {}
@Post("/create")
async create(@Body() laporandto: DtoLaporan) {
    return this.laporanService.create(laporandto)
}

@Get("/findAll")
async findAll(@Query() query: ListReportsDto) {
  return this.laporanService.findAll(query)
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
