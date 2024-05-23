import { Column, OneToMany, Entity, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { PropuestaEntity } from '../../propuesta/propuesta.entity/propuesta.entity';

@Entity()
export class ProfesorEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupoInvestigacion: string;

    @Column()
    numExtension: number;

    @OneToMany(() => PropuestaEntity, propuesta => propuesta.profesor)
    propuestas: PropuestaEntity[];

}
