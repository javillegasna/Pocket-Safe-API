import { Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../models/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { AccountsService } from 'src/accounts/service/accounts.service';
import { Account } from 'src/accounts/models/account.entity';
import { UpdateUserInput } from '../dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
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
      id,
      ...updateUserInput,
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

  getAllAccounts(userId: string): Promise<Account[]> {
    return this.accountsService.findAllByUserId(userId);
  }
}
