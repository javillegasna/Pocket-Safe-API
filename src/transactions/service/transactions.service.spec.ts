import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { accountFactory } from 'src/accounts/common/mock/account.factory';
import { Account } from 'src/accounts/models/account.entity';
import {
  createTransactionFactory,
  transactionFactory,
  updateTransactionFactory,
} from '../common/mock/transactions.factory';
import { Transaction } from '../models/transaction.entity';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockTransactionRepository;

  const mockTransaction = transactionFactory();
  const mockAccount = accountFactory();
  const mockAccountRepository = {
    findOneBy: jest.fn((query) =>
      Promise.resolve({ ...mockAccount, id: query.id }),
    ),
  };
  beforeEach(async () => {
    mockTransactionRepository = {
      find: jest.fn().mockResolvedValue([mockTransaction]),
      save: jest.fn((transaction) => Promise.resolve(transaction)),
      create: jest.fn((dto) => ({ ...mockTransaction, ...dto })),
      remove: jest.fn((transaction) => Promise.resolve(transaction)),
      restore: jest.fn((transaction) => Promise.resolve(transaction)),
      softRemove: jest.fn((transaction) => Promise.resolve(transaction)),
      findOneBy: jest.fn((query) =>
        Promise.resolve({ ...mockTransaction, id: query.id }),
      ),
      findOne: jest.fn((query) =>
        Promise.resolve({ ...mockTransaction, id: query.where.id }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be return an Transaction when create was called', async () => {
    const mockInputTransaction = createTransactionFactory();
    expect(await service.create(mockInputTransaction, mockAccount)).toEqual({
      ...mockTransaction,
      ...mockInputTransaction,
      accounts: [{ ...mockAccount }],
    });
    expect(mockTransactionRepository.create).toHaveBeenCalled();
    expect(mockTransactionRepository.create).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.save).toHaveBeenCalled();
    expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return an transaction array when findAll was called', async () => {
    expect(await service.findAll()).toStrictEqual([mockTransaction]);
    expect(mockTransactionRepository.find).toHaveBeenCalled();
    expect(mockTransactionRepository.find).toHaveBeenCalledTimes(1);
  });

  it('Should be return an Transaction with the same id that was send', async () => {
    const mockTransactionId = faker.datatype.uuid();
    expect(await service.findOne(mockTransactionId)).toEqual({
      ...mockTransaction,
      id: mockTransactionId,
    });
    expect(mockTransactionRepository.findOne).toHaveBeenCalled();
    expect(mockTransactionRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('should be return an Transaction with the new data inside', async () => {
    const mockTransactionId = faker.datatype.uuid();
    const mockUpdateTransaction = updateTransactionFactory({
      id: mockTransactionId,
      categoryId: mockTransaction.categoryId,
      amount: mockTransaction.amount,
    });
    expect(
      await service.update(mockTransactionId, mockUpdateTransaction),
    ).toEqual({
      ...mockTransaction,
      id: mockUpdateTransaction.id,
    });
    expect(mockTransactionRepository.save).toHaveBeenCalled();
    expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return an transaction with the same id when remove was called', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await service.remove(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionRepository.findOne).toHaveBeenCalled();
    expect(mockTransactionRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.softRemove).toHaveBeenCalled();
    expect(mockTransactionRepository.softRemove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an transaction with the same id when recover was called', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await service.recover(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionRepository.findOne).toHaveBeenCalled();
    expect(mockTransactionRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.restore).toHaveBeenCalled();
    expect(mockTransactionRepository.restore).toHaveBeenCalledTimes(1);
  });

  it('Should be return a transaction with the same id when permanentRemoveTransaction was called', async () => {
    const transactionId = faker.datatype.uuid();
    const transaction = await service.permanentRemove(transactionId);
    expect(transaction.id).toBe(transactionId);
    expect(mockTransactionRepository.findOne).toHaveBeenCalled();
    expect(mockTransactionRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.remove).toHaveBeenCalled();
    expect(mockTransactionRepository.remove).toHaveBeenCalledTimes(1);
  });
});
