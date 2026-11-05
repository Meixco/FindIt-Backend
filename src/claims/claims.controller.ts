import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClaimsService } from './claims.service.js';
import {
  DtoClaims,
  ListClaimsDto,
  UpdateClaimStatusDto,
} from '../dto/claims.dto.js';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly servisKlaim: ClaimsService) {}

  // Untuk Pengguna
  @Post('/create')
  async create(@Body() createKlaim: DtoClaims) {
    return this.servisKlaim.create(createKlaim);
  }
}

// Untuk Admin

@Controller('admin/claims')
export class AdminClaimsController {
  constructor(private readonly servisKlaim: ClaimsService) {}
  @Get('/find')
  async getAll(@Query() query: ListClaimsDto) {
    return this.servisKlaim.findAll(query);
  }

  @Get('/find/:id')
  async getOne(@Param('id') id: number) {
    return this.servisKlaim.findOne(id);
  }

  @Patch('perbaruiStatus/:id')
  async updateStatus(
    @Param('id') id: number,
    updateStatus: UpdateClaimStatusDto,
  ) {
    return this.servisKlaim.gantiStatus(id, updateStatus);
  }
}
