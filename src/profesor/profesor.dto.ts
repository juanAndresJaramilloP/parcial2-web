import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProfesorDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly grupoInvestigacion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly cedula: number;

    @IsNumber()
    @IsNotEmpty()
    readonly numExtension: number;
}
