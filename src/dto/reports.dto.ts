import { IsDateString, IsInt, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OmitType, PickType, PartialType } from "@nestjs/mapped-types";

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

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsInt()
    @IsNotEmpty()
    locationId: number;

    @IsDateString()
    @IsNotEmpty()
    event_date: string;

    @IsString()
    @IsOptional()
    event_time_optional?: string;

    @IsString()
    @IsOptional()
    photo_url_optional?: string;
}

export class UpdateDto extends PartialType (DtoLaporan){}