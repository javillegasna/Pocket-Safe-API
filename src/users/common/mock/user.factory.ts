import { faker } from '@faker-js/faker';
import { Account } from 'src/accounts/models/account.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { User } from 'src/users/models/user.entity';

interface IUser extends ICreateUserInput {
  id?: string;
  accounts?: Account[];
}

interface ICreateUserInput {
  name?: string;
  lastName?: string;
  nickName?: string;
}

interface IUpdateUser extends ICreateUserInput {
  id?: string;
}
export function userFactory({ ...args }: IUser = {}) {
  const user: User = {
    id: faker.datatype.uuid(),
    ...createUserFactory(),
    accounts: [],
    ...args,
  };
  return user;
}

export function createUserFactory({ ...args }: ICreateUserInput = {}) {
  const createUser: CreateUserInput = {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    nickName: faker.name.suffix(),
    ...args,
  };
  return createUser;
}

export function updateUserFactory({ ...args }: IUpdateUser = {}) {
  const user: UpdateUserInput = {
    id: faker.datatype.uuid(),
    ...createUserFactory(),
    ...args,
  };
  return user;
}
