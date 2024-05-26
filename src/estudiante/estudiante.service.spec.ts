import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let estudianteList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estudianteList = [];
    for (let i = 0; i < 5; i++) {
      const estudiante: EstudianteEntity = await repository.save({
        nombre: faker.person.fullName(),
        codigo: faker.string.alphanumeric(10),
        creditos: faker.number.int(300),
      });
      estudianteList.push(estudiante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a student by id', async () => {
    const storedEstudiante: EstudianteEntity = estudianteList[0];
    const result = await service.findOne(storedEstudiante.id);
    expect(result).not.toBeNull();
    expect(result.nombre).toEqual(storedEstudiante.nombre);
    expect(result.codigo).toEqual(storedEstudiante.codigo);
    expect(result.creditos).toEqual(storedEstudiante.creditos);
  });

  it('findOne should throw an error if the student does not exist', async () => {
    const estudianteId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    try {
      await service.findOne(estudianteId);
    } catch (error) {
      expect(error.message).toBe('The estudiante with the given id was not found');
    }
  });

  it('Create should create a new student', async () => {
    const newEstudiante: EstudianteEntity = {
      id: "",
      nombre: 'Juan Andres',
      codigo: '2018213050',
      creditos: 130,
      proyecto: null,
    };
    const result = await service.create(newEstudiante);
    expect(result.nombre).toEqual(newEstudiante.nombre);
    expect(result.codigo).toEqual(newEstudiante.codigo);
    expect(result.creditos).toEqual(newEstudiante.creditos);
    expect(result.proyecto).toEqual(newEstudiante.proyecto);
  });

  it('Create should throw an error if codigo.length is < 10', async () => {
    const newEstudiante: EstudianteEntity = {
      id: "",
      nombre: 'Juan Andres',
      codigo: '2',
      creditos: 130,
      proyecto: null,
    };
    try {
      await service.create(newEstudiante);
    } catch (error) {
      expect(error.message).toBe('El codigo del estudiante debe tener 10 caracteres');
    }
  });

});
