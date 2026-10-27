import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class DTOContact {
    @IsInt()
    id: number;

    @IsInt()
    @IsNotEmpty()
    reportId: number;

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