import { IsString, IsInt } from "class-validator"
import { OmitType, PickType } from "@nestjs/mapped-types";

export class DtoCategories {
@IsInt()
id: number;

@IsString()
name: string;
}

export class TambahKategori extends PickType(DtoCategories, ["id", "name"]){}

export class UpdateKategori extends PickType(DtoCategories, ["id", "name"]){}

export class DeleteKategori extends OmitType(DtoCategories, ["name"]){}