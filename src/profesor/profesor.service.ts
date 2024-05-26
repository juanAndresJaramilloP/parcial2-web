import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ProfesorEntity } from './profesor.entity/profesor.entity';

@Injectable()
export class ProfesorService {

    constructor(
        @InjectRepository(ProfesorEntity)
        private readonly profesorRepository: Repository<ProfesorEntity>
    ) {}

    async findOne(id: string): Promise<ProfesorEntity> {

        //verifica que el formato del id siga aquel de la los ids de las bases de dartos de postgres
        if (!/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/.test(id)) {
            throw new BusinessLogicException("Invalid id format. HINT: Valid UUID values are of the form \'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF\'", BusinessError.BAD_REQUEST);
        }

        const profesor: ProfesorEntity = await this.profesorRepository.findOne({where:{id}, relations: ['propuestas']});
        if (!profesor) {
            throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
        }

        return profesor;
    }

    async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {

        if(profesor.grupoInvestigacion !== 'TICSW' && profesor.grupoInvestigacion !== 'IMAGINE' && profesor.grupoInvestigacion !== 'COMIT'){
            throw new BusinessLogicException("El grupo de investigacion debe ser uno de estos: TICSW,IMAGINE o COMIT", BusinessError.BAD_REQUEST);
        }

        return await this.profesorRepository.save(profesor);
    }


    async delete(id: string): Promise<void> {

        //verifica que el formato del id siga aquel de la los ids de las bases de dartos de postgres
        if (!/^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/.test(id)) {
            throw new BusinessLogicException("Invalid id format. HINT: Valid UUID values are of the form \'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF\'", BusinessError.BAD_REQUEST);
        }

        const persistedProfesor: ProfesorEntity = await this.profesorRepository.findOne({where:{id}, relations: ['propuestas']});
        if(!persistedProfesor) {
            throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
        }

        for (let i = 0; i < persistedProfesor.propuestas?.length; i++) {
            if(persistedProfesor.propuestas[i].proyecto){
                throw new BusinessLogicException("No se puede borrar un profesor si tiene una propuesta con algun proyecto", BusinessError.BAD_REQUEST);
            }
        }

        await this.profesorRepository.remove(persistedProfesor);
    }

    async deleteByCedula(cedula: number): Promise<void> {

        const persistedProfesor: ProfesorEntity = await this.profesorRepository.findOne({where:{cedula:cedula}});
        if(!persistedProfesor) {
            throw new BusinessLogicException("The profesor with the given cedula was not found", BusinessError.NOT_FOUND);
        }

        for (let i = 0; i < persistedProfesor.propuestas?.length; i++) {
            if(persistedProfesor.propuestas[i].proyecto){
                throw new BusinessLogicException("No se puede borrar un profesor si tiene una propuesta con algun proyecto", BusinessError.BAD_REQUEST);
            }
        }

        await this.profesorRepository.remove(persistedProfesor);
    }

}
