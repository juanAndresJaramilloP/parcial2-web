import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Injectable()
export class EstudianteService {

    constructor(
        @InjectRepository(EstudianteEntity)
        private readonly estudianteRepository: Repository<EstudianteEntity>
    ) {}

    async findOne(id: string): Promise<EstudianteEntity> {

        // id format de postgres
        if (!/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/.test(id)) {
            throw new BusinessLogicException("Invalid id format. HINT: Valid UUID values are of the form \'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF\'", BusinessError.BAD_REQUEST);
        }

        const estudiante: EstudianteEntity = await this.estudianteRepository.findOne({where:{id}, relations: ['proyecto']});
        if (!estudiante) {
            throw new BusinessLogicException("The estudiante with the given id was not found", BusinessError.NOT_FOUND);
        }

        return estudiante;
    }

    async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {

        if(estudiante.codigo.length !== 10){
            throw new BusinessLogicException("El codigo del estudiante debe tener 10 caracteres", BusinessError.BAD_REQUEST);
        }

        return await this.estudianteRepository.save(estudiante);
    }


}
