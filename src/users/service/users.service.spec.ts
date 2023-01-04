import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createUserFactory,
  updateUserFactory,
  userFactory,
} from '../common/mock/user.factory';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../models/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockInputUser: CreateUserInput = createUserFactory();
  const mockUser: User = userFactory();

  const mockUserRepository = {
    save: jest.fn((user) => Promise.resolve(user)),
    find: jest.fn().mockResolvedValue([mockUser]),
    remove: jest.fn((user) => Promise.resolve(user)),
    softRemove: jest.fn((user) => Promise.resolve(user)),
    create: jest.fn((dto: CreateUserInput) => ({ ...mockUser, ...dto })),
    findOneBy: jest.fn((query) =>
      Promise.resolve({ ...mockUser, id: query.id }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should be return a user when create was called', async () => {
    expect(await service.create(mockInputUser)).toEqual({
      ...mockUser,
      ...mockInputUser,
    });
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be return a users array when findAll was called', async () => {
    expect(await service.findAll()).toStrictEqual([mockUser]);
    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id that was send', async () => {
    const mockUserId = faker.datatype.uuid();
    expect(await service.findOne(mockUserId)).toEqual({
      ...mockUser,
      id: mockUserId,
    });
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should be return a user wit the new data inside', async () => {
    const mockUserId = faker.datatype.uuid();
    const mockUpdateUser = updateUserFactory({ id: mockUserId });
    expect(await service.update(mockUserId, mockUpdateUser)).toEqual({
      ...mockUpdateUser,
    });
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('Should be return a user with the same id when remove was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await service.remove(userId);
    expect(user.id).toBe(userId);
    expect(mockUserRepository.softRemove).toHaveBeenCalled();
    expect(mockUserRepository.softRemove).toHaveBeenCalledTimes(1);
  });
  it('Should be return a user with the same id when permanentRemoveUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await service.permanentRemove(userId);
    expect(user.id).toBe(userId);
    expect(mockUserRepository.remove).toHaveBeenCalled();
    expect(mockUserRepository.remove).toHaveBeenCalledTimes(1);
  });
});
