import { faker } from '@faker-js/faker';
import { categoryFactory } from 'src/categories/common/mock/category.factory';
import { CreateTransactionInput } from 'src/transactions/dto/create-transaction.input';
import { UpdateTransactionInput } from 'src/transactions/dto/update-transaction.input';
import { Transaction } from 'src/transactions/models/transaction.entity';
import { TransactionType } from '../transactions.enums';

type ICreateTransaction = Partial<CreateTransactionInput>;

type ITransaction = Partial<Transaction>;

type IUpdateTransaction = Partial<UpdateTransactionInput>;

export function createTransactionFactory({ ...args }: ICreateTransaction = {}) {
  const createTransaction: CreateTransactionInput = {
    amount: faker.datatype.float(),
    transactionType: TransactionType.INPUT,
    categoryId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid(),
    ...args,
  };
  return createTransaction;
}

export function transactionFactory({ ...args }: ITransaction = {}) {
  const transaction: Transaction = {
    id: faker.datatype.uuid(),
    categoryId: faker.datatype.uuid(),
    category: categoryFactory(),
    accounts: [],
    amount: faker.datatype.float(),
    transactionType: TransactionType.INPUT,
    ...args,
  };
  return transaction;
}

export function updateTransactionFactory({ ...args }: IUpdateTransaction = {}) {
  const updateTransaction: UpdateTransactionInput = {
    id: faker.datatype.uuid(),
    amount: faker.datatype.float(),
    transactionType: TransactionType.INPUT,
    categoryId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid(),
    ...args,
  };
  return updateTransaction;
}
