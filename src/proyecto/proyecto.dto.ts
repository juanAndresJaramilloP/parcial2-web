import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProyectoDto {

    @IsString()
    @IsNotEmpty()
    readonly url: string;

    @IsNumber()
    @IsNotEmpty()
    readonly fechaFin: number;

    @IsNumber()
    @IsNotEmpty()
    readonly fechaInicio: number;
}
