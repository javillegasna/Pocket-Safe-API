import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';
import * as request from 'supertest';

import { UsersModule } from '../../src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { createUserFactory } from '../../src/users/common/mock/user.factory';

import { createCategoryFactory } from 'src/categories/common/mock/category.factory';
import { CreateTransactionInput } from 'src/transactions/dto/create-transaction.input';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { createAccountFactory } from 'src/accounts/common/mock/account.factory';
import {
  createTransactionFactory,
  updateTransactionFactory,
} from 'src/transactions/common/mock/transactions.factory';

describe('AccountModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let userId: string;
  let accountId: string;
  let categoryId: string;
  let transactionId: string;
  let mockCreateTransaction: CreateTransactionInput;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [join(process.cwd(), 'src/**/*.entity{.ts,.js}')],
          synchronize: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
        }),
        UsersModule,
        CategoriesModule,
        AccountsModule,
        TransactionsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  it('/ User Resolver (mutation create)', async () => {
    const mockCreateUserInput = createUserFactory();
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation CreateUser($userInput: CreateUserInput!) {
          createUser(userInput: $userInput) {
            name,
            lastName,
            id,
          }
        }`,
        variables: { userInput: mockCreateUserInput },
      })
      .expect(200);

    const { createUser } = response.body.data;
    userId = createUser.id;

    expect(createUser).toEqual({
      name: mockCreateUserInput.name,
      lastName: mockCreateUserInput.lastName,
      id: userId,
    });
  });

  it('/ Account Resolver (mutation create)', async () => {
    const mockCreateAccount = createAccountFactory({ userId });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation CreateAccount($createAccountInput: CreateAccountInput!) {
          createAccount(createAccountInput: $createAccountInput) {
            userId,
            type,
            name,
            icon,
            id,
          }
        }`,
        variables: { createAccountInput: mockCreateAccount },
      })
      .expect(200);

    const { createAccount } = response.body.data;
    accountId = createAccount.id;

    expect(createAccount).toEqual({
      name: mockCreateAccount.name,
      type: mockCreateAccount.type,
      icon: mockCreateAccount.icon,
      userId: mockCreateAccount.userId,
      id: accountId,
    });
  });

  it('/ Category Resolver (mutation create)', async () => {
    const mockCreateCategory = createCategoryFactory({ userId });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
          createCategory(createCategoryInput: $createCategoryInput) {
            userId,
            categoryName,
            icon,
            id,
          }
        }`,
        variables: { createCategoryInput: mockCreateCategory },
      })
      .expect(200);

    const { createCategory } = response.body.data;
    categoryId = createCategory.id;

    expect(createCategory).toEqual({
      categoryName: mockCreateCategory.categoryName,
      icon: mockCreateCategory.icon,
      userId: mockCreateCategory.userId,
      id: categoryId,
    });
  });

  it('/ Transaction Resolver (mutation create)', async () => {
    mockCreateTransaction = createTransactionFactory({ accountId, categoryId });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($createTransactionInput: CreateTransactionInput!) {
          createTransaction(createTransactionInput: $createTransactionInput) {
            transactionType
            amount
            categoryId
            id
          }
        }`,
        variables: { createTransactionInput: mockCreateTransaction },
      })
      .expect(200);

    const { createTransaction } = response.body.data;
    transactionId = createTransaction.id;

    expect(createTransaction).toEqual({
      amount: mockCreateTransaction.amount,
      transactionType: mockCreateTransaction.transactionType,
      categoryId: mockCreateTransaction.categoryId,
      id: transactionId,
    });
  });

  it('/ Category Resolver (query findAll)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Query {
          transactions {
            id
            accounts {
              id
            }
            amount
            transactionType
            categoryId
          }
        }`,
      })
      .expect(200);

    const { transactions } = response.body.data;

    expect(transactions.length).toBe(1);
    expect(transactions[0]).toEqual({
      accounts: [{ id: accountId }],
      categoryId: categoryId,
      amount: mockCreateTransaction.amount,
      transactionType: mockCreateTransaction.transactionType,
      id: transactionId,
    });
  });

  it('/ Transaction Resolver (query findOne)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Transaction($transactionId: String!) {
          transaction(id: $transactionId) {
            id
            accounts {
              id
            }
            amount
            transactionType
            categoryId
          }
        }`,
        variables: { transactionId },
      })
      .expect(200);

    const { transaction } = response.body.data;

    expect(transaction).toEqual({
      id: transactionId,
      accounts: [{ id: accountId }],
      amount: mockCreateTransaction.amount,
      transactionType: mockCreateTransaction.transactionType,
      categoryId: categoryId,
    });
  });

  it('/ Transaction Resolver (mutation updateTransaction)', async () => {
    const mockUpdateTransactionInput = updateTransactionFactory({
      id: transactionId,
      categoryId,
      accountId,
    });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($updateTransactionInput: UpdateTransactionInput!) {
          updateTransaction(updateTransactionInput: $updateTransactionInput) {
            accounts {
              id
            }
            amount
            categoryId
            id
            transactionType
          }
        }`,
        variables: { updateTransactionInput: mockUpdateTransactionInput },
      })
      .expect(200);

    const { updateTransaction } = response.body.data;

    expect(updateTransaction).toEqual({
      accounts: [{ id: accountId }],
      amount: mockUpdateTransactionInput.amount,
      categoryId,
      id: transactionId,
      transactionType: mockUpdateTransactionInput.transactionType,
    });
  });

  it('/ Transaction Resolver (mutation removeTransaction)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($removeTransactionId: String!) {
          removeTransaction(id: $removeTransactionId) {
            accounts {
              id
            }
            categoryId
            id
          }
        }`,
        variables: { removeTransactionId: transactionId },
      })
      .expect(200);

    const { removeTransaction } = response.body.data;

    expect(removeTransaction).toEqual({
      accounts: [{ id: accountId }],
      categoryId,
      id: transactionId,
    });
  });

  it('/ Transaction Resolver (mutation recoverTransaction)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($recoverTransactionId: String!) {
          recoverTransaction(id: $recoverTransactionId) {
            accounts {
              id
            }
            id
            categoryId
          }
        }`,
        variables: { recoverTransactionId: transactionId },
      })
      .expect(200);

    const { recoverTransaction } = response.body.data;

    expect(recoverTransaction).toEqual({
      accounts: [{ id: accountId }],
      categoryId,
      id: transactionId,
    });
  });

  it('/ Transaction Resolver (mutation permanentRemoveTransaction)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($permanentRemoveTransactionId: String!) {
          permanentRemoveTransaction(id: $permanentRemoveTransactionId) {
            accounts {
              id
            }
            categoryId
            id
          }
        }`,
        variables: { permanentRemoveTransactionId: transactionId },
      })
      .expect(200);

    const { permanentRemoveTransaction } = response.body.data;

    expect(permanentRemoveTransaction).toEqual({
      accounts: [{ id: accountId }],
      categoryId,
      id: transactionId,
    });
  });
});
