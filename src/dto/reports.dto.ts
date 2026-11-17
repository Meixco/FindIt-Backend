import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { OmitType, PickType, PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from './pagination.dto.js';
import { Transform, Type } from 'class-transformer';
import { LostAndFoundStatus } from '../entities/reports.entity.js';
import { UPLOADED_IMAGE_PATH_REGEX } from '../utills/image.utills.js';

export enum ReportType {
  LOST = 'lost',
  PENDING = 'pending',
  FOUND = 'found',
}

export const REPORT_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'event_date',
  'item_name',
] as const;

export type ReportSortField = (typeof REPORT_SORT_FIELDS)[number];
export class DtoLaporan {
  @IsString()
  @IsNotEmpty()
  report_type: string;

  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsString()
  @IsNotEmpty()
  description_public: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsOptional()
  @IsEnum(LostAndFoundStatus)
  status?: LostAndFoundStatus;

  @IsDateString()
  @IsNotEmpty()
  event_date: string;

  @IsString()
  @IsOptional()
  event_time_optional?: string;

  @IsString()
  @IsOptional()
  @Matches(UPLOADED_IMAGE_PATH_REGEX, { message: 'photo_url harus berasal dari hasil upload' })
  photo_url_optional?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) 
  @IsBoolean()
  remove_photo_url_optional?: boolean;
}

export class UpdateDto extends PartialType(DtoLaporan) {

}

export class UpdateStatusReportsDto {
  @IsIn([LostAndFoundStatus.LOST, LostAndFoundStatus.FOUND])
  status: LostAndFoundStatus
}

export class ListReportsDto extends PaginationDto {
  @IsOptional()
  @IsIn(REPORT_SORT_FIELDS)
  sort_by: ReportSortField = 'createdAt';

  @IsOptional()
  @IsEnum(ReportType)
  report_type?: ReportType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  category_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  location_id?: number;

  @IsOptional()
  @IsEnum(ReportType)
  status?: string;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;
}
