import { faker } from '@faker-js/faker';
import { CreateAccountInput } from 'src/accounts/dto/create-account.input';
import { UpdateAccountInput } from 'src/accounts/dto/update-account.input';
import { Account } from 'src/accounts/models/account.entity';
import { userFactory } from 'src/users/common/mock/user.factory';
import { User } from 'src/users/models/user.entity';
import { AccountType } from '../accounts.enums';

type ICreateAccount = Partial<CreateAccountInput>;

interface IAccount extends ICreateAccount {
  id?: string;
  user?: User;
}

interface IUpdateAccount extends ICreateAccount {
  id?: string;
}

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
    user: userFactory({ id: userId }),
    transactions: [],
    ...createAccount,
    ...args,
  };
  return account;
}

export function updateAccountFactory({ ...args }: IUpdateAccount = {}) {
  const createAccount = createAccountFactory();
  const updateAccount: UpdateAccountInput = {
    id: faker.datatype.uuid(),
    ...createAccount,
    ...args,
  };
  return updateAccount;
}
