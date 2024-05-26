/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';
import { PropuestaEntity } from '../../propuesta/propuesta.entity/propuesta.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [EstudianteEntity, ProyectoEntity, PropuestaEntity, ProfesorEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([EstudianteEntity, ProyectoEntity, PropuestaEntity, ProfesorEntity]),
];