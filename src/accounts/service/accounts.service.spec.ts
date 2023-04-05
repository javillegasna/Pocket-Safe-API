import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '../models/account.entity';
import { AccountsService } from './accounts.service';
import {
  accountFactory,
  createAccountFactory,
  updateAccountFactory,
} from '../common/mock/account.factory';
import { BadRequestException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;

  const mockAccount = accountFactory({ totalAmount: 1000 });

  let mockAccountRepository;

  beforeEach(async () => {
    mockAccountRepository = {
      find: jest.fn().mockResolvedValue([mockAccount]),
      save: jest.fn((account) => Promise.resolve(account)),
      remove: jest.fn((account) => Promise.resolve(account)),
      create: jest.fn((dto) => ({ ...mockAccount, ...dto })),
      restore: jest.fn((account) => Promise.resolve(account)),
      softRemove: jest.fn((account) => Promise.resolve(account)),
      findOneBy: jest.fn((query) =>
        Promise.resolve({ ...mockAccount, id: query.id }),
      ),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be return an Account when create was called', async () => {
    const mockInputAccount = createAccountFactory();
    expect(await service.create(mockInputAccount)).toEqual({
      ...mockAccount,
      ...mockInputAccount,
      totalAmount: 0,
    });
    expect(mockAccountRepository.create).toHaveBeenCalled();
    expect(mockAccountRepository.create).toHaveBeenCalledTimes(1);
    expect(mockAccountRepository.save).toHaveBeenCalled();
    expect(mockAccountRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return an accounts array when findAll was called', async () => {
    expect(await service.findAll()).toStrictEqual([mockAccount]);
    expect(mockAccountRepository.find).toHaveBeenCalled();
    expect(mockAccountRepository.find).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with the same id that was send', async () => {
    const mockAccountId = faker.datatype.uuid();
    expect(await service.findOne(mockAccountId)).toEqual({
      ...mockAccount,
      id: mockAccountId,
    });
    expect(mockAccountRepository.findOneBy).toHaveBeenCalled();
    expect(mockAccountRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should be return an account with the new data inside', async () => {
    const mockAccountId = faker.datatype.uuid();
    const mockUpdateAccount = updateAccountFactory({ id: mockAccountId });
    expect(await service.update(mockAccountId, mockUpdateAccount)).toEqual({
      ...mockUpdateAccount,
    });
    expect(mockAccountRepository.save).toHaveBeenCalled();
  });

  it('Should be return an account with the same id when remove was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await service.remove(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountRepository.findOneBy).toHaveBeenCalled();
    expect(mockAccountRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockAccountRepository.softRemove).toHaveBeenCalled();
    expect(mockAccountRepository.softRemove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with the same id when recoverAccount was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await service.recover(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountRepository.findOneBy).toHaveBeenCalled();
    expect(mockAccountRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockAccountRepository.restore).toHaveBeenCalled();
    expect(mockAccountRepository.restore).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id when permanentRemoveUser was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await service.permanentRemove(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountRepository.remove).toHaveBeenCalled();
    expect(mockAccountRepository.remove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with amount increase', async () => {
    const accountId = faker.datatype.uuid();
    const amount = faker.datatype.number();
    const account = await service.addIncomingAmount(accountId, amount);
    expect(account.totalAmount).toBe(mockAccount.totalAmount + amount);
    expect(mockAccountRepository.findOneBy).toHaveBeenCalled();
    expect(mockAccountRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with amount decrease', async () => {
    const accountId = faker.datatype.uuid();
    const amount = faker.datatype.number(100);
    const account = await service.subtractOutgoingAmount(accountId, amount);
    expect(account.totalAmount).toBe(mockAccount.totalAmount - amount);
  });

  it('Should be trow error if the amount is higher than totalAmount', async () => {
    const accountId = faker.datatype.uuid();
    const amount = 2000;
    await expect(() =>
      service.subtractOutgoingAmount(accountId, amount),
    ).rejects.toThrowError(BadRequestException);
  });
});
