import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { join } from 'path';
import * as request from 'supertest';

import { User } from '../../src/users/models/user.entity';
import { UsersModule } from '../../src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Account } from '../../src/accounts/models/account.entity';
import { createUserFactory } from '../../src/users/common/mock/user.factory';
import { CreateAccountInput } from 'src/accounts/dto/create-account.input';
import {
  createAccountFactory,
  updateAccountFactory,
} from 'src/accounts/common/mock/account.factory';

describe('AccountModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let userId: string;
  let accountId: string;
  let mockCreateAccount: CreateAccountInput;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Account],
          synchronize: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
        }),
        UsersModule,
        AccountsModule,
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
    mockCreateAccount = createAccountFactory({ userId });
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

  it('/ Account Resolver (query findAll)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Accounts {
          accounts {
            userId,
            type,
            name,
            icon,
            id,
          }
        }`,
      })
      .expect(200);

    const { accounts } = response.body.data;

    expect(accounts.length).toBe(1);
    expect(accounts[0]).toEqual({
      name: mockCreateAccount.name,
      type: mockCreateAccount.type,
      icon: mockCreateAccount.icon,
      userId: mockCreateAccount.userId,
      id: accountId,
    });
  });

  it('/ Account Resolver (query findOne)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Account($accountId: String!) {
          account(id: $accountId) {
            userId,
            type,
            name,
            icon,
            id,
          }
        }`,
        variables: { accountId },
      })
      .expect(200);

    const { account } = response.body.data;

    expect(account).toEqual({
      name: mockCreateAccount.name,
      type: mockCreateAccount.type,
      icon: mockCreateAccount.icon,
      userId: mockCreateAccount.userId,
      id: accountId,
    });
  });

  it('/ Account Resolver (mutation updateAccount)', async () => {
    const mockUpdateAccountInput = updateAccountFactory({
      id: accountId,
      userId,
    });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($updateAccountInput: UpdateAccountInput!) {
          updateAccount(updateAccountInput: $updateAccountInput) {
            userId,
            type,
            name,
            icon,
            id,
          }
        }`,
        variables: { updateAccountInput: mockUpdateAccountInput },
      })
      .expect(200);

    const { updateAccount } = response.body.data;

    expect(updateAccount).toEqual({
      name: mockUpdateAccountInput.name,
      type: mockUpdateAccountInput.type,
      icon: mockUpdateAccountInput.icon,
      userId: mockUpdateAccountInput.userId,
      id: mockUpdateAccountInput.id,
    });
  });

  it('/ Account Resolver (mutation removeAccount)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation($removeAccountId: String!){
          removeAccount(id: $removeAccountId) {
            userId,
            id,
          }
        }`,
        variables: { removeAccountId: accountId },
      })
      .expect(200);

    const { removeAccount } = response.body.data;

    expect(removeAccount).toEqual({
      id: accountId,
      userId,
    });
  });

  it('/ Account Resolver (mutation recoverAccount)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($recoverAccountId: String!) {
          recoverAccount(id: $recoverAccountId) {
            userId
            id
          }
        }`,
        variables: { recoverAccountId: accountId },
      })
      .expect(200);

    const { recoverAccount } = response.body.data;

    expect(recoverAccount).toEqual({
      id: accountId,
      userId,
    });
  });

  it('/ Account Resolver (mutation permanentRemoveAccount)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($permanentRemoveAccountId: String!) {
          permanentRemoveAccount(id: $permanentRemoveAccountId) {
            userId,
            id,
          }
        }`,
        variables: { permanentRemoveAccountId: accountId },
      })
      .expect(200);

    const { permanentRemoveAccount } = response.body.data;

    expect(permanentRemoveAccount).toEqual({
      id: accountId,
      userId,
    });
  });
});
