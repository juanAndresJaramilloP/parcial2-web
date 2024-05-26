import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;
  let proyectoList: ProyectoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    proyectoList = [];
    for(let i = 0; i < 5; i++){
      const proyecto: ProyectoEntity = await repository.save({
        url: faker.internet.url(), 
        fechaFin: faker.number.int({ min: 70, max: 100 }), 
        fechaInicio: faker.number.int({ min: 0, max: 69 }), 
      });
      proyectoList.push(proyecto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should save a project', async () => {
    const newProposal: ProyectoEntity = {
      id: "",
      url: faker.internet.url(), 
      fechaFin: faker.number.int({ min: 70, max: 100 }), 
      fechaInicio: faker.number.int({ min: 0, max: 69 }), 
      propuesta: null,
      estudiante: null,
    };
    const result = await service.create(newProposal);
    expect(result.url).toEqual(newProposal.url);
    expect(result.fechaFin).toEqual(newProposal.fechaFin);
    expect(result.fechaInicio).toEqual(newProposal.fechaInicio);
  });

  it('create should throw an error if the start date is after the end date', async () => {
    const newProposal: ProyectoEntity = {
      id: "",
      url: faker.internet.url(), 
      fechaFin: 20240525, 
      fechaInicio: 20250530, 
      propuesta: null,
      estudiante: null,
    };
    try {
      await service.create(newProposal);
    } catch (error) {
      expect(error.message).toBe('la fecha de inicio no puede ser posterior a la fecha de fin del proyecto');
    }
  });

});
