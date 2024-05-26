import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorService } from './profesor.service';
import { ProfesorDto } from './profesor.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('profesores')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProfesorController {

    constructor(private readonly profesorService: ProfesorService) {}

    @Get(':profesorId')
    async findOne(@Param('profesorId') profesorId: string) {
      return await this.profesorService.findOne(profesorId);
    }
  
    @Post()
    async create(@Body() profesorDto: ProfesorDto) {
      const profesor: ProfesorEntity = plainToInstance(ProfesorEntity, profesorDto);
      return await this.profesorService.create(profesor);
    }
  
    @Delete(':profesorId')
    @HttpCode(204)
    async delete(@Param('profesorId') profesorId: string) {
      return await this.profesorService.delete(profesorId);
    }

    @Delete(':profesorCedula')
    @HttpCode(204)
    async deleteByCedula(@Param('profesorCedula') profesorCedula: number) {
        return await this.profesorService.deleteByCedula(profesorCedula);
    }
}
