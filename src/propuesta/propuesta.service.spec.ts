import { Test, TestingModule } from '@nestjs/testing';
import { PropuestaEntity } from './propuesta.entity/propuesta.entity';
import { PropuestaService } from './propuesta.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PropuestaService', () => {
  let service: PropuestaService;
  let repository: Repository<PropuestaEntity>;
  let propuestaList: PropuestaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PropuestaService],
    }).compile();

    service = module.get<PropuestaService>(PropuestaService);
    repository = module.get<Repository<PropuestaEntity>>(getRepositoryToken(PropuestaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    propuestaList = [];
    for(let i = 0; i < 5; i++){
      const proposal: PropuestaEntity = await repository.save({
        titulo: faker.string.alphanumeric(40), 
        descripcion: faker.string.alphanumeric(100), 
        palabraClave: faker.string.alphanumeric(20), 
      });
      propuestaList.push(proposal);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all proposals', async () => {
    const result: PropuestaEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(propuestaList.length);
  });

  it('findOne should return a proposal by id', async () => {
    const storedProposal: PropuestaEntity = propuestaList[0];
    const result = await service.findOne(storedProposal.id);
    expect(result).not.toBeNull();
    expect(result.titulo).toEqual(storedProposal.titulo);
    expect(result.descripcion).toEqual(storedProposal.descripcion);
    expect(result.palabraClave).toEqual(storedProposal.palabraClave);
  });

  it('findOne should throw an error if the proposal does not exist', async () => {
    const proposalId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    try {
      await service.findOne(proposalId);
    } catch (error) {
      expect(error.message).toBe('The propuesta with the given id was not found');
    }
  });

  it('Create should create a new proposal', async () => {
    const newProposal: PropuestaEntity = {
      id: "",
      titulo: 'Titulo Propuesta',
      descripcion: 'Esta es una descripcion de la propuesta',
      palabraClave: 'clave',
      proyecto: null,
      profesor: null,
    };
    const result = await service.create(newProposal);
    expect(result.titulo).toEqual(newProposal.titulo);
    expect(result.descripcion).toEqual(newProposal.descripcion);
    expect(result.palabraClave).toEqual(newProposal.palabraClave);
  });

  it('Create should throw an error if the proposal title is empty', async () => {
    const newProposal: PropuestaEntity = {
      id: "",
      titulo: ' ',
      descripcion: 'Esta es una descripcion de la propuesta',
      palabraClave: 'clave',
      proyecto: null,
      profesor: null,
    };
    try {
      await service.create(newProposal);
    } catch (error) {
      expect(error.message).toBe('El titulo de la propuesta no puede ser vacio');
    }
  });

  it('Delete should delete a proposal by id', async () => {
    const proposalId = propuestaList[0].id;
    await service.delete(proposalId);
    const result = await repository.findOne({where:{id: proposalId}});
    expect(result).toBeNull();
  });

  it('Delete should throw an exception for an invalid proposal', async () => {
    await expect(() => service.delete("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF")).rejects.toHaveProperty("message", "The propuesta with the given id was not found")
  });

});
