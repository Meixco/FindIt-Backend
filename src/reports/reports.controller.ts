import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { DtoLaporan, ListReportsDto, UpdateDto, UpdateStatusReportsDto } from '../dto/reports.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_UPLOAD_OPTIONS } from '../utills/image.utills.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly laporanService: ReportsService) {}
@Post("/create")
@Throttle({default: {limit: 10,ttl: 60_000}})
@UseInterceptors(FileInterceptor('photo', IMAGE_UPLOAD_OPTIONS))
async create(@Body() laporandto: DtoLaporan, @UploadedFile() photo?: Express.Multer.File) {
    return this.laporanService.create(laporandto, photo)
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
@UseInterceptors(FileInterceptor('photo', IMAGE_UPLOAD_OPTIONS))
async update(@Param("id") id: string, @Body() updateDto: UpdateDto, @UploadedFile() photo?: Express.Multer.File) {
  return this.laporanService.update(id, updateDto, photo)
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