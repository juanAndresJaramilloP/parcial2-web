import { Column, OneToOne, Entity, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ProyectoEntity } from '../../proyecto/proyecto.entity/proyecto.entity';

@Entity()
export class EstudianteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    creditos: number;

    @OneToOne(() => ProyectoEntity, proyecto => proyecto.estudiante)
    @JoinColumn()
    proyecto: ProyectoEntity;

}
