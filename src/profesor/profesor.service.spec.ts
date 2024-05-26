import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorService } from './profesor.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;
  let profesorList: ProfesorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(getRepositoryToken(ProfesorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    profesorList = [];
    for(let i = 0; i < 5; i++){
      const profesor: ProfesorEntity = await repository.save({
        nombre: faker.person.fullName(), 
        cedula: faker.number.int(), 
        grupoInvestigacion: 'TICSW', 
        numExtension: faker.number.int(),
      });
      profesorList.push(profesor);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a teacher by id', async () => {
    const storedProfesor: ProfesorEntity = profesorList[0];
    const result = await service.findOne(storedProfesor.id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(storedProfesor.nombre);
    expect(result.cedula).toEqual(storedProfesor.cedula);
    expect(result.grupoInvestigacion).toEqual(storedProfesor.grupoInvestigacion);
    expect(result.numExtension).toEqual(storedProfesor.numExtension);
  });

  it('findOne should throw an error if the teacher does not exist', async () => {
    const profesorId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    try {
      await service.findOne(profesorId);
    } catch (error) {
      expect(error.message).toBe('The profesor with the given id was not found');
    }
  });

  it('create should save a teacher', async () => {
    const newProfesor: ProfesorEntity = {
      id: "",
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      grupoInvestigacion: 'TICSW',
      numExtension: faker.number.int(),
      propuestas: [],
    };
    const result = await service.create(newProfesor);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(newProfesor.nombre);
    expect(result.cedula).toEqual(newProfesor.cedula);
    expect(result.grupoInvestigacion).toEqual(newProfesor.grupoInvestigacion);
    expect(result.numExtension).toEqual(newProfesor.numExtension);
    expect(result.propuestas).toEqual(newProfesor.propuestas);
  });

  it('create should throw an error if grupoInvestigacion is not TICSW, IMAGINE or COMIT', async () => {
    const newProfesor: ProfesorEntity = {
      id: "",
      nombre: faker.person.fullName(),
      cedula: faker.number.int(),
      grupoInvestigacion: faker.string.alphanumeric(40),
      numExtension: faker.number.int(),
      propuestas: [],
    };
    try {
      await service.create(newProfesor);
    } catch (error) {
      expect(error.message).toBe('El grupo de investigacion debe ser uno de estos: TICSW,IMAGINE o COMIT');
    }
  });

  it('delete should remove a teacher', async () => {
    const storedProfesor: ProfesorEntity = profesorList[0];
    await service.delete(storedProfesor.id);
    const result = await repository.findOne({where:{id: storedProfesor.id}});
    expect(result).toBeNull();
  });

  it('delete should throw an error if the teacher was not found', async () => {
    try {
      await service.delete('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF');
    } catch (error) {
      expect(error.message).toBe('The profesor with the given id was not found');
    }
  });

  it('deleteByCedula should remove a teacher by its cedula', async () => {
    const storedProfesor: ProfesorEntity = profesorList[0];
    await service.deleteByCedula(storedProfesor.cedula);
    const result = await repository.findOne({where:{cedula: storedProfesor.cedula}});
    expect(result).toBeNull();
  });

  it('deleteByCedula should throw an error if the teacher with the given cedula was not found', async () => {
    try {
      await service.deleteByCedula(-1);
    } catch (error) {
      expect(error.message).toBe('The profesor with the given cedula was not found');
    }
  });

});
