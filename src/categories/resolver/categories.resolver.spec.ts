import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from '../service/categories.service';
import { UsersService } from 'src/users/service/users.service';
import {
  categoryFactory,
  createCategoryFactory,
  updateCategoryFactory,
} from '../common/mock/category.factory';
import { faker } from '@faker-js/faker';
import { accountFactory } from 'src/accounts/common/mock/account.factory';
import { userFactory } from 'src/users/common/mock/user.factory';

describe('CategoriesResolver', () => {
  let resolver: CategoriesResolver;

  const mockCategory = categoryFactory();

  const mockUserService = {
    findOne: jest.fn((id) => userFactory({ id })),
  };
  const mockCategoryService = {
    create: jest.fn((dto) => ({ ...mockCategory, ...dto })),
    findAll: jest.fn(() => [mockCategory]),
    findOne: jest.fn((id) => categoryFactory({ id })),
    update: jest.fn((id, dto) => ({ ...mockCategory, ...dto, id })),
    remove: jest.fn((id) => categoryFactory({ id })),
    recover: jest.fn((id) => categoryFactory({ id })),
    permanentRemove: jest.fn((id) => categoryFactory({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesResolver,
        { provide: UsersService, useValue: mockUserService },
        { provide: CategoriesService, useValue: mockCategoryService },
      ],
    }).compile();

    resolver = module.get<CategoriesResolver>(CategoriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should be return a category when createCategory was called', () => {
    const mockInputCategory = createCategoryFactory();
    expect(resolver.createCategory(mockInputCategory)).toEqual({
      ...mockCategory,
      ...mockInputCategory,
    });
    expect(mockCategoryService.create).toHaveBeenCalled();
    expect(mockCategoryService.create).toHaveBeenCalledTimes(1);
  });

  it('Should be return a category array when findAll was called', () => {
    expect(resolver.findAll()).toStrictEqual([mockCategory]);
    expect(mockCategoryService.findAll).toHaveBeenCalled();
    expect(mockCategoryService.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id that was send', async () => {
    const CategoryId = faker.datatype.uuid();
    const user = await resolver.findOne(CategoryId);
    expect(user.id).toBe(CategoryId);
    expect(mockCategoryService.findOne).toHaveBeenCalled();
    expect(mockCategoryService.findOne).toHaveBeenCalledTimes(1);
  });

  it('should be return a category wit the new data inside', () => {
    const mockUpdateCategory = updateCategoryFactory();
    expect(resolver.updateCategory(mockUpdateCategory)).toEqual({
      ...mockCategory,
      ...mockUpdateCategory,
    });
    expect(mockCategoryService.update).toHaveBeenCalled();
    expect(mockCategoryService.update).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id when removeCategory was called', async () => {
    const categoryId = faker.datatype.uuid();
    const category = await resolver.removeCategory(categoryId);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryService.remove).toHaveBeenCalled();
    expect(mockCategoryService.remove).toHaveBeenCalledTimes(1);
  });
  it('Should be return an user with the same id when user was called', async () => {
    const userId = faker.datatype.uuid();
    const mockUser = userFactory({ id: userId });
    const account = accountFactory({ userId, user: mockUser });
    const user = await resolver.user(account);
    expect(user.id).toBe(userId);
    expect(mockCategoryService.findOne).toHaveBeenCalled();
    expect(mockCategoryService.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id when recoverCategory was called', async () => {
    const categoryId = faker.datatype.uuid();
    const category = await resolver.recoverCategory(categoryId);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryService.recover).toHaveBeenCalled();
    expect(mockCategoryService.recover).toHaveBeenCalledTimes(1);
  });

  it('Should be return a category with the same id when permanentRemoveCategory was called', async () => {
    const categoryId = faker.datatype.uuid();
    const account = await resolver.permanentRemoveCategory(categoryId);
    expect(account.id).toBe(categoryId);
    expect(mockCategoryService.permanentRemove).toHaveBeenCalled();
    expect(mockCategoryService.permanentRemove).toHaveBeenCalledTimes(1);
  });
});
