import { Column, OneToOne, Entity, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { PropuestaEntity } from '../../propuesta/propuesta.entity/propuesta.entity';

@Entity()
export class ProyectoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column()
    fechaFin: number;

    @Column()
    fechaInicio: number;

    @OneToOne(() => EstudianteEntity, estudiante => estudiante.proyecto)
    estudiante: EstudianteEntity; 

    @OneToOne(() => PropuestaEntity, propuesta => propuesta.proyecto)
    propuesta: PropuestaEntity;

}
