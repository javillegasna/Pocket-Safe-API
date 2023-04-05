import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../models/account.entity';
import { UpdateAccountInput } from '../dto/update-account.input';
import { CreateAccountInput } from '../dto/create-account.input';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async addIncomingAmount(accountId: string, amount: number): Promise<Account> {
    const destinationAccount = await this.findOne(accountId);
    destinationAccount.totalAmount += amount;
    return await this.update(accountId, destinationAccount);
  }

  async subtractOutgoingAmount(
    accountId: string,
    amount: number,
  ): Promise<Account> {
    const originAccount = await this.findOne(accountId);
    if (amount > originAccount.totalAmount) {
      throw new BadRequestException('Insufficient account funds', {
        cause: new Error(),
        description:
          'the amount to be withdrawn from the account exceeds the funds in that one',
      });
    }
    originAccount.totalAmount -= amount;
    return this.update(accountId, originAccount);
  }

  create(createAccountInput: CreateAccountInput): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountInput,
      totalAmount: 0,
    });
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

  update(id: string, updateAccountInput: UpdateAccountInput): Promise<Account> {
    return this.accountRepository.save({
      id,
      ...updateAccountInput,
    });
  }

  async remove(id: string) {
    const account = await this.accountRepository.findOneBy({ id });
    return this.accountRepository.softRemove(account);
  }

  async recover(id: string): Promise<Account> {
    await this.accountRepository.restore(id);
    const account = await this.accountRepository.findOneBy({ id });
    return account;
  }

  async permanentRemove(id: string) {
    const account = await this.accountRepository.findOneBy({ id });
    await this.accountRepository.remove(account);
    return { ...account, id };
  }
}
