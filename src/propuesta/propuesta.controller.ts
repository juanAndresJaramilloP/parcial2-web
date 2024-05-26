import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';
import { PropuestaService } from './propuesta.service';
import { PropuestaDto } from './propuesta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('propuestas')
@UseInterceptors(BusinessErrorsInterceptor)
export class PropuestaController {

    constructor(
        private readonly propuestaService: PropuestaService,
    ){}

    @Get()
    async findAll() {
      return await this.propuestaService.findAll();
    }

    @Get(':propuestaId')
    async findOne(@Param('propuestaId') propuestaId: string) {
      return await this.propuestaService.findOne(propuestaId);
    }
  
    @Post()
    async create(@Body() propuestaDto: PropuestaDto) {
      const propuesta: PropuestaEntity = plainToInstance(PropuestaEntity, propuestaDto);
      return await this.propuestaService.create(propuesta);
    }
  
    @Delete(':propuestaId')
    @HttpCode(204)
    async delete(@Param('propuestaId') propuestaId: string) {
      return await this.propuestaService.delete(propuestaId);
    }

}
