import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {

    constructor(private readonly estudianteService: EstudianteService) {}

    @Get(':estudianteId')
    async findOne(@Param('estudianteId') estudianteId: string) {
      return await this.estudianteService.findOne(estudianteId);
    }
  
    @Post()
    async create(@Body() estudianteDto: EstudianteDto) {
      const estudiante: EstudianteEntity = plainToInstance(EstudianteEntity, estudianteDto);
      return await this.estudianteService.create(estudiante);
    }
}
