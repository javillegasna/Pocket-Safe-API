import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/service/users.service';

import { AccountsResolver } from './accounts.resolver';
import { AccountsService } from '../service/accounts.service';
import {
  accountFactory,
  createAccountFactory,
  updateAccountFactory,
} from '../common/mock/account.factory';
import { faker } from '@faker-js/faker';

describe('AccountsResolver', () => {
  let resolver: AccountsResolver;

  const mockAccount = accountFactory();

  const mockUserService = {};
  const mockAccountService = {
    create: jest.fn((dto) => ({ ...mockAccount, ...dto })),
    findAll: jest.fn(() => [mockAccount]),
    findOne: jest.fn((id) => accountFactory({ id })),
    update: jest.fn((dto) => ({ ...mockAccount, ...dto })),
    remove: jest.fn((id) => accountFactory({ id })),
    recover: jest.fn((id) => accountFactory({ id })),
    permanentRemove: jest.fn((id) => accountFactory({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsResolver,
        { provide: UsersService, useValue: mockUserService },
        { provide: AccountsService, useValue: mockAccountService },
      ],
    }).compile();

    resolver = module.get<AccountsResolver>(AccountsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should be return an account when createAccount was called', () => {
    const mockInputAccount = createAccountFactory();
    expect(resolver.createAccount(mockInputAccount)).toEqual({
      ...mockAccount,
      ...mockInputAccount,
    });
    expect(mockAccountService.create).toHaveBeenCalled();
    expect(mockAccountService.create).toHaveBeenCalledTimes(1);
  });

  it('Should be return a accounts array when findAll was called', () => {
    expect(resolver.findAll()).toStrictEqual([mockAccount]);
    expect(mockAccountService.findAll).toHaveBeenCalled();
    expect(mockAccountService.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with the same id that was send', async () => {
    const AccountId = faker.datatype.uuid();
    const user = await resolver.findOne(AccountId);
    expect(user.id).toBe(AccountId);
    expect(mockAccountService.findOne).toHaveBeenCalled();
    expect(mockAccountService.findOne).toHaveBeenCalledTimes(1);
  });

  it('should be return a user wit the new data inside', () => {
    const mockUpdateAccount = updateAccountFactory();
    expect(mockAccountService.update(mockUpdateAccount)).toEqual({
      ...mockAccount,
      ...mockUpdateAccount,
    });
    expect(mockAccountService.update).toHaveBeenCalled();
    expect(mockAccountService.update).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with the same id when removeAccount was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await resolver.removeAccount(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountService.remove).toHaveBeenCalled();
    expect(mockAccountService.remove).toHaveBeenCalledTimes(1);
  });

  it('Should be return an account with the same id when recoverAccount was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await resolver.recoverAccount(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountService.recover).toHaveBeenCalled();
    expect(mockAccountService.recover).toHaveBeenCalledTimes(1);
  });

  it('Should be return a account with the same id when permanentRemoveUser was called', async () => {
    const accountId = faker.datatype.uuid();
    const account = await resolver.permanentRemoveAccount(accountId);
    expect(account.id).toBe(accountId);
    expect(mockAccountService.permanentRemove).toHaveBeenCalled();
    expect(mockAccountService.permanentRemove).toHaveBeenCalledTimes(1);
  });
});
