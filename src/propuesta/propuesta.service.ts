import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';

@Injectable()
export class PropuestaService {

    constructor(
        @InjectRepository(PropuestaEntity)
        private readonly propuestaRepository: Repository<PropuestaEntity>
    ) {}

    async findAll(): Promise<PropuestaEntity[]> {
        return await this.propuestaRepository.find({ relations: ['proyecto','profesor']});
    }

    async findOne(id: string): Promise<PropuestaEntity> {

        if (!/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/.test(id)) {
            throw new BusinessLogicException("Invalid id format. HINT: Valid UUID values are of the form \'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF\'", BusinessError.BAD_REQUEST);
        }

        const propuesta: PropuestaEntity = await this.propuestaRepository.findOne({where:{id}, relations: ['proyecto','profesor']});
        if (!propuesta) {
            throw new BusinessLogicException("The propuesta with the given id was not found", BusinessError.NOT_FOUND);
        }

        return propuesta;
    }

    async create(propuesta: PropuestaEntity): Promise<PropuestaEntity> {

        if(propuesta.titulo.trim() === ''){
            throw new BusinessLogicException("El titulo de la propuesta no puede ser vacio", BusinessError.BAD_REQUEST);
        }

        return await this.propuestaRepository.save(propuesta);
    }

    async delete(id: string): Promise<void> {

        if (!/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/.test(id)) {
            throw new BusinessLogicException("Invalid id format. HINT: Valid UUID values are of the form \'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF\'", BusinessError.BAD_REQUEST);
        }

        const persistedPropuesta: PropuestaEntity = await this.propuestaRepository.findOne({where:{id}});
        if(!persistedPropuesta) {
            throw new BusinessLogicException("The propuesta with the given id was not found", BusinessError.NOT_FOUND);
        }

        if(persistedPropuesta.proyecto){
            throw new BusinessLogicException("Una propuesta no se puede eliminar si tiene un proyecto", BusinessError.BAD_REQUEST);
        }

        await this.propuestaRepository.remove(persistedPropuesta);
    }

}
