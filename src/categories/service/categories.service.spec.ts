import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Category } from '../models/category.entity';
import { CategoriesService } from './categories.service';
import {
  categoryFactory,
  createCategoryFactory,
  updateCategoryFactory,
} from '../common/mock/category.factory';
import { faker } from '@faker-js/faker';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategory = categoryFactory();
  let mockCategoryRepository;

  beforeEach(async () => {
    mockCategoryRepository = {
      find: jest.fn().mockResolvedValue([mockCategory]),
      save: jest.fn((category) => Promise.resolve(category)),
      create: jest.fn((dto) => ({ ...mockCategory, ...dto })),
      remove: jest.fn((category) => Promise.resolve(category)),
      restore: jest.fn((category) => Promise.resolve(category)),
      softRemove: jest.fn((category) => Promise.resolve(category)),
      findOneBy: jest.fn((query) =>
        Promise.resolve({ ...mockCategory, id: query.id }),
      ),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be return an Category when create was called', async () => {
    const mockInputCategory = createCategoryFactory();
    expect(await service.create(mockInputCategory)).toEqual({
      ...mockCategory,
      ...mockInputCategory,
    });
    expect(mockCategoryRepository.create).toHaveBeenCalled();
    expect(mockCategoryRepository.create).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.save).toHaveBeenCalled();
    expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return an Category array when findAll was called', async () => {
    expect(await service.findAll()).toStrictEqual([mockCategory]);
    expect(mockCategoryRepository.find).toHaveBeenCalled();
    expect(mockCategoryRepository.find).toHaveBeenCalledTimes(1);
  });

  it('Should be return an Category with the same id that was send', async () => {
    const mockCategoryId = faker.datatype.uuid();
    expect(await service.findOne(mockCategoryId)).toEqual({
      ...mockCategory,
      id: mockCategoryId,
    });
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should be return an category with the new data inside', async () => {
    const mockCategoryId = faker.datatype.uuid();
    const mockUpdateCategory = updateCategoryFactory({ id: mockCategoryId });
    expect(await service.update(mockCategoryId, mockUpdateCategory)).toEqual({
      ...mockUpdateCategory,
    });
    expect(mockCategoryRepository.save).toHaveBeenCalled();
    expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id when remove was called', async () => {
    const categoryId = faker.datatype.uuid();
    const category = await service.remove(categoryId);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.softRemove).toHaveBeenCalled();
    expect(mockCategoryRepository.softRemove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id when recover was called', async () => {
    const categoryId = faker.datatype.uuid();
    const category = await service.recover(categoryId);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.restore).toHaveBeenCalled();
    expect(mockCategoryRepository.restore).toHaveBeenCalledTimes(1);
  });

  it('Should be return a category with the same id when permanentRemoveCategory was called', async () => {
    const categoryId = faker.datatype.uuid();
    const category = await service.permanentRemove(categoryId);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.remove).toHaveBeenCalled();
    expect(mockCategoryRepository.remove).toHaveBeenCalledTimes(1);
  });
});
