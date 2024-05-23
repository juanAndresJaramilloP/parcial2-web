/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ClienteEntity } from '../../cliente/cliente.entity/cliente.entity'; y todas las demas entidades...


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [/* aqui van las entities*/],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([/* aqui van las entities*/]),
];