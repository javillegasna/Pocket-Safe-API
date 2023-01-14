import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../models/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from '../service/users.service';
import { CreateUserInput } from '../dto/create-user.input';
import {
  createUserFactory,
  updateUserFactory,
  userFactory,
} from '../common/mock/user.factory';
import { AccountsService } from 'src/accounts/service/accounts.service';
describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const mockInputUser: CreateUserInput = createUserFactory();
  const mockUser: User = userFactory();

  const mockUsersService = {
    create: jest.fn((dto) => ({ ...mockUser, ...dto })),
    findAll: jest.fn(() => [mockUser]),
    findOne: jest.fn((id) => userFactory({ id })),
    update: jest.fn((dto) => ({ ...mockUser, ...dto })),
    remove: jest.fn((id) => userFactory({ id })),
    recover: jest.fn((id) => userFactory({ id })),
    permanentRemove: jest.fn((id) => userFactory({ id })),
  };

  const mockAccountService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: mockUsersService },
        { provide: AccountsService, useValue: mockAccountService },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('Should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should be return a user when createUser was called', () => {
    expect(resolver.createUser(mockInputUser)).toEqual({
      ...mockUser,
      ...mockInputUser,
    });
    expect(mockUsersService.create).toHaveBeenCalled();
    expect(mockUsersService.create).toHaveBeenCalledTimes(1);
  });

  it('Should be return a users array when findAll was called', () => {
    expect(resolver.findAll()).toStrictEqual([mockUser]);
    expect(mockUsersService.findAll).toHaveBeenCalled();
    expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id that was send', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.findOne(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.findOne).toHaveBeenCalled();
    expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
  });

  it('should be return a user wit the new data inside', () => {
    const mockUpdateUser = updateUserFactory();
    expect(mockUsersService.update(mockUpdateUser)).toEqual({
      ...mockUser,
      ...mockUpdateUser,
    });
    expect(mockUsersService.update).toHaveBeenCalled();
    expect(mockUsersService.update).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id when removeUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.remove).toHaveBeenCalled();
    expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
  });
  it('Should be return a user with the same id when recoverUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.recoverUser(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.recover).toHaveBeenCalled();
    expect(mockUsersService.recover).toHaveBeenCalledTimes(1);
  });
  it('Should be return a user with the same id when permanentRemoveUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.permanentRemoveUser(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.permanentRemove).toHaveBeenCalled();
    expect(mockUsersService.permanentRemove).toHaveBeenCalledTimes(1);
  });
});
