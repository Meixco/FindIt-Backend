import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { PaginationDto } from './pagination.dto.js';
import { ClaimStatus } from '../entities/claims.entity.js';

export enum ClaimStatusFilter {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const CLAIM_SORT_FIELDS = [
  'createdAt',
  'reviewedAt',
  'claimant_name',
] as const;

export const REPORT_ID_REGEX = /^(FIND|LOST)-\d{5,}$/;

export type ClaimSortField = (typeof CLAIM_SORT_FIELDS)[number];

export class DtoClaims {
  @IsString()
  reportId: string;

  @IsString()
  claimant_name: string;

  @IsString()
  @IsOptional()
  student_number_optional?: string;

  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus

  @IsString()
  contact_private: string;

  @IsString()
  claim_details_private: string;
}

export class UpdateClaimStatusDto {
  @IsIn([ClaimStatus.APPROVED, ClaimStatus.REJECTED])
  status: ClaimStatus.APPROVED | ClaimStatus.REJECTED
}

export class ListClaimsDto extends PaginationDto {
  @IsOptional()
  @IsIn(CLAIM_SORT_FIELDS)
  sort_by: ClaimSortField = 'createdAt';

  @IsOptional()
  @IsEnum(ClaimStatusFilter)
  status?: ClaimStatusFilter;

  // Jika ID Anda UUID, ganti dengan: @IsUUID() report_id?: string;
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @Matches(REPORT_ID_REGEX, {
    message: 'Format report_id tidak valid, contoh: FIND-26001',
  })
  report_id?: number;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;
}
