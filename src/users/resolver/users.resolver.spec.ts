import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../service/users.service';
import { UsersResolver } from './users.resolver';
import { CreateUserInput } from '../dto/create-user.input';
import {
  createUserFactory,
  updateUserFactory,
  userFactory,
} from '../common/mock/user.factory';
import { User } from '../models/user.entity';
import { faker } from '@faker-js/faker';
describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const mockInputUser: CreateUserInput = createUserFactory();
  const mockUser: User = userFactory();
  const mockUsersService = {
    create: jest.fn((dto) => ({ ...mockUser, ...dto })),
    findAll: jest.fn(() => [mockUser]),
    findOne: jest.fn((id) => userFactory({ id })),
    updateUser: jest.fn((dto) => ({ ...mockUser, ...dto })),
    remove: jest.fn((id) => userFactory({ id })),
    permanentRemove: jest.fn((id) => userFactory({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

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
    expect(mockUsersService.updateUser(mockUpdateUser)).toEqual({
      ...mockUser,
      ...mockUpdateUser,
    });
    expect(mockUsersService.updateUser).toHaveBeenCalled();
    expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id when removeUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.remove).toHaveBeenCalled();
    expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
  });
  it('Should be return a user with the same id when permanentRemoveUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await resolver.permanentRemoveUser(userId);
    expect(user.id).toBe(userId);
    expect(mockUsersService.permanentRemove).toHaveBeenCalled();
    expect(mockUsersService.permanentRemove).toHaveBeenCalledTimes(1);
  });
});
