import { faker } from '@faker-js/faker';
import { CreateAccountInput } from 'src/accounts/dto/create-account.input';
import { UpdateAccountInput } from 'src/accounts/dto/update-account.input';
import { Account } from 'src/accounts/models/account.entity';
import { userFactory } from 'src/users/common/mock/user.factory';
import { AccountType } from '../accounts.enums';

type ICreateAccount = Partial<CreateAccountInput>;

type IAccount = Partial<Account>;

type IUpdateAccount = Partial<UpdateAccountInput>;

export function createAccountFactory({ ...args }: ICreateAccount = {}) {
  const createAccount: CreateAccountInput = {
    name: faker.finance.accountName(),
    type: AccountType.SAVINGS,
    icon: faker.image.abstract(),
    userId: faker.datatype.uuid(),
    ...args,
  };
  return createAccount;
}

export function accountFactory({ ...args }: IAccount = {}) {
  const userId = faker.datatype.uuid();
  const createAccount = createAccountFactory({ userId });
  const account: Account = {
    id: faker.datatype.uuid(),
    totalAmount: 0,
    transactions: [],
    user: userFactory({ id: userId }),
    ...createAccount,
    ...args,
  };
  return account;
}

export function updateAccountFactory({ ...args }: IUpdateAccount = {}) {
  const createAccount = createAccountFactory();
  const updateAccount: UpdateAccountInput = {
    id: faker.datatype.uuid(),
    totalAmount: 0,
    ...createAccount,
    ...args,
  };
  return updateAccount;
}
