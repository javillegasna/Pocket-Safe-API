import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/models/account.entity';

import { Repository } from 'typeorm';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { UpdateTransactionInput } from '../dto/update-transaction.input';
import { Transaction } from '../models/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}
  async create(
    createTransactionInput: CreateTransactionInput,
    updatedAccount: Account,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.create(
      createTransactionInput,
    );
    return this.transactionRepository.save({
      ...transaction,
      accounts: [updatedAccount],
    });
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['accounts'] });
  }

  findOne(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });
  }

  async update(
    id: string,
    updateTransactionInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.save({
      id,
      ...updateTransactionInput,
    });
    return this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ['accounts'],
    });
  }

  async remove(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });
    return this.transactionRepository.softRemove(transaction);
  }

  async recover(id: string) {
    await this.transactionRepository.restore(id);
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });
  }

  async permanentRemove(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['accounts'],
    });
    await this.transactionRepository.remove(transaction);
    return { ...transaction, id };
  }
}
