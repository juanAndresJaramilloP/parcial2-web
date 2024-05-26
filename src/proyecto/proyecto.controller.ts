import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoDto } from './proyecto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('proyectos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProyectoController {

    constructor(private readonly proyectoService: ProyectoService) {}

    @Post()
    async create(@Body() proyectoDto: ProyectoDto) {
      const proyecto: ProyectoEntity = plainToInstance(ProyectoEntity, proyectoDto);
      return await this.proyectoService.create(proyecto);
    }
    
}
