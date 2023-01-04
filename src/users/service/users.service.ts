import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../models/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(user: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.userRepository.save({
      ...updateUserInput,
      id,
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.softRemove(user);
  }

  async permanentRemove(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.remove(user);
  }
}
