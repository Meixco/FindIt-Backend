import { IsString, IsInt } from "class-validator";
import { OmitType, PickType, PartialType } from "@nestjs/mapped-types";

export class LocationsDto {
    @IsInt()
    id: number;

    @IsString()
    campus: string;

    @IsString()
    buliding: string;

    @IsString()
    area_name: string;
}

export class TambahLokasi extends PickType (LocationsDto, ["id", "campus", "buliding", "area_name"]) {}

export class UpdateLokasi extends OmitType (LocationsDto, ['id']) {}