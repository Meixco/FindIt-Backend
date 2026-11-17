import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { DtoLaporan, ListReportsDto, UpdateDto, UpdateStatusReportsDto } from '../dto/reports.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

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

@Put("/update/:id")
async update(@Param("id") id: string, @Body() updateDto: UpdateDto) {
  return this.laporanService.update(id, updateDto)
}

@Delete("/delete/:id")
async delete(@Param("id") id: string) {
  return this.laporanService.delete(id)
}
}

// Untuk Admin
@Controller('admin/reports')
@UseGuards(JwtAuthGuard)
export class AdminReportsController {
 constructor (private readonly serviceReports: ReportsService) {}
@Put("/updateStatus/:id")
 async updateStatus (@Param("id") id: string, @Body() updateDto: UpdateStatusReportsDto) {
  return this.serviceReports.updateStatusReport(id, updateDto)
 } 
}