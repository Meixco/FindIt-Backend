import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClaimsService } from './claims.service.js';
import {
  DtoClaims,
  ListClaimsDto,
  UpdateClaimStatusDto,
} from '../dto/claims.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

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
@UseGuards(JwtAuthGuard)
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

  @Put('perbaruiStatus/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatus: UpdateClaimStatusDto,
  ) {
    return this.servisKlaim.updateStatus(id, updateStatus);
  }
}
