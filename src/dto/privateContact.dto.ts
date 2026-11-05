import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DTOContact {
    @IsInt()
    @IsOptional()
    id: number;

    @IsString()
    @IsNotEmpty()
    reportId: string;

    @IsString()
    @IsNotEmpty()
    contact_name: string;

    @IsString()
    @IsNotEmpty()
    contact_method: string;

    @IsString()
    @IsNotEmpty()
    contact_value: string;
}

export class updateContact extends PartialType(DTOContact) {}