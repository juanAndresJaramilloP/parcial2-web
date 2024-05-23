import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';

@Injectable()
export class ProyectoService {

    constructor(
        @InjectRepository(ProyectoEntity)
        private readonly proyectoRepository: Repository<ProyectoEntity>
    ) {}

    async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {

        if(proyecto.fechaInicio > proyecto.fechaFin){
            throw new BusinessLogicException("la fecha de inicio no puede ser posterior a la fecha de fin del proyecto", BusinessError.BAD_REQUEST);
        }

        return await this.proyectoRepository.save(proyecto);
    }

}
