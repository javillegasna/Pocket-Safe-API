import { Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../models/account.entity';
import { UpdateAccountInput } from '../dto/update-account.input';
import { CreateAccountInput } from '../dto/create-account.input';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
  create(createAccountInput: CreateAccountInput): Promise<Account> {
    const account = this.accountRepository.create(createAccountInput);
    return this.accountRepository.save(account);
  }

  findAll(): Promise<Account[]> {
    return this.accountRepository.find({
      withDeleted: true,
    });
  }

  findAllByUserId(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId },
    });
  }

  findOne(id: string): Promise<Account> {
    return this.accountRepository.findOneBy({ id });
  }

  update(id: string, updateAccountInput: UpdateAccountInput) {
    return this.accountRepository.save({
      id,
      ...updateAccountInput,
    });
  }

  async remove(id: string) {
    const account = await this.accountRepository.findOneBy({ id });
    return this.accountRepository.softRemove(account);
  }
  async removePermanently(id: string) {
    const account = await this.accountRepository.findOneBy({ id });
    return this.accountRepository.remove(account);
  }
  getUser(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
