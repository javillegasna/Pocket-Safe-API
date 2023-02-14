import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from '../service/transactions.service';
import {
  createTransactionFactory,
  transactionFactory,
  updateTransactionFactory,
} from '../common/mock/transactions.factory';
import { categoryFactory } from 'src/categories/common/mock/category.factory';
import { CategoriesService } from 'src/categories/service/categories.service';
import { faker } from '@faker-js/faker';

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;
  const mockTransaction = transactionFactory();

  const mockCategoryService = {
    findOne: jest.fn((id) => categoryFactory({ id })),
  };
  const mockTransactionService = {
    create: jest.fn((dto) => ({ ...mockTransaction, ...dto })),
    findAll: jest.fn(() => [mockTransaction]),
    findOne: jest.fn((id) => transactionFactory({ id })),
    update: jest.fn((id, dto) => ({ ...mockTransaction, ...dto, id })),
    remove: jest.fn((id) => transactionFactory({ id })),
    recover: jest.fn((id) => transactionFactory({ id })),
    permanentRemove: jest.fn((id) => transactionFactory({ id })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsResolver,
        {
          provide: TransactionsService,
          useValue: mockTransactionService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    resolver = module.get<TransactionsResolver>(TransactionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should be return a Transaction when createCategory was called', () => {
    const mockInputTransaction = createTransactionFactory();
    expect(resolver.createTransaction(mockInputTransaction)).toEqual({
      ...mockTransaction,
      ...mockInputTransaction,
    });
    expect(mockTransactionService.create).toHaveBeenCalled();
    expect(mockTransactionService.create).toHaveBeenCalledTimes(1);
  });

  it('Should be return a transaction array when findAll was called', () => {
    expect(resolver.findAll()).toStrictEqual([mockTransaction]);
    expect(mockTransactionService.findAll).toHaveBeenCalled();
    expect(mockTransactionService.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should be return a transaction with the same id that was send', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await resolver.findOne(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionService.findOne).toHaveBeenCalled();
    expect(mockTransactionService.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should be return a transaction wit the new data inside', () => {
    const mockUpdateTransaction = updateTransactionFactory();
    expect(resolver.updateTransaction(mockUpdateTransaction)).toEqual({
      ...mockTransaction,
      ...mockUpdateTransaction,
    });
    expect(mockTransactionService.update).toHaveBeenCalled();
    expect(mockTransactionService.update).toHaveBeenCalledTimes(1);
  });

  it('Should be return an transaction with the same id when removeTransaction was called', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await resolver.removeTransaction(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionService.remove).toHaveBeenCalled();
    expect(mockTransactionService.remove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an category with the same id when Category was called', async () => {
    const categoryId = faker.datatype.uuid();
    const mockCategory = categoryFactory({ id: categoryId });
    const transaction = transactionFactory({
      categoryId,
      category: mockCategory,
    });
    const category = await resolver.category(transaction);
    expect(category.id).toBe(categoryId);
    expect(mockCategoryService.findOne).toHaveBeenCalled();
    expect(mockCategoryService.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should be return an transaction with the same id when recoverTransaction was called', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await resolver.recoverTransaction(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionService.recover).toHaveBeenCalled();
    expect(mockTransactionService.recover).toHaveBeenCalledTimes(1);
  });

  it('Should be return a transaction when revive an id', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await resolver.permanentRemoveTransaction(
      transactionId,
    );
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionService.permanentRemove).toHaveBeenCalled();
    expect(mockTransactionService.permanentRemove).toHaveBeenCalledTimes(1);
  });
});
