import { faker } from '@faker-js/faker';
import { Account } from 'src/accounts/models/account.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { User } from 'src/users/models/user.entity';

type ICreateUser = Partial<CreateUserInput>;

interface IUser extends ICreateUser {
  id?: string;
  accounts?: Account[];
}

interface IUpdateUser extends ICreateUser {
  id?: string;
}

export function createUserFactory({ ...args }: ICreateUser = {}) {
  const createUser: CreateUserInput = {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    nickName: faker.name.suffix(),
    ...args,
  };
  return createUser;
}

export function userFactory({ ...args }: IUser = {}) {
  const user: User = {
    id: faker.datatype.uuid(),
    ...createUserFactory(),
    accounts: [],
    categories: [],
    ...args,
  };
  return user;
}

export function updateUserFactory({ ...args }: IUpdateUser = {}) {
  const user: UpdateUserInput = {
    id: faker.datatype.uuid(),
    ...createUserFactory(),
    ...args,
  };
  return user;
}
