import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../models/user.entity';
import { UsersService } from './users.service';
import {
  createUserFactory,
  updateUserFactory,
  userFactory,
} from '../common/mock/user.factory';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = userFactory();

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    save: jest.fn((user) => Promise.resolve(user)),
    remove: jest.fn((user) => Promise.resolve(user)),
    restore: jest.fn((user) => Promise.resolve(user)),
    create: jest.fn((dto) => ({ ...mockUser, ...dto })),
    softRemove: jest.fn((user) => Promise.resolve(user)),
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
    const mockInputUser = createUserFactory();
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

  it('should be return a user with the new data inside', async () => {
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

  it('Should be return a user with the same id when recoverUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await service.recover(userId);
    expect(user.id).toBe(userId);
    expect(mockUserRepository.restore).toHaveBeenCalled();
    expect(mockUserRepository.restore).toHaveBeenCalledTimes(1);
  });

  it('Should be return a user with the same id when permanentRemoveUser was called', async () => {
    const userId = faker.datatype.uuid();
    const user = await service.permanentRemove(userId);
    expect(user.id).toBe(userId);
    expect(mockUserRepository.remove).toHaveBeenCalled();
    expect(mockUserRepository.remove).toHaveBeenCalledTimes(1);
  });
});
