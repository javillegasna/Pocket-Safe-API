import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import {
  createUserFactory,
  updateUserFactory,
} from '../../src/users/common/mock/user.factory';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/users/models/user.entity';
import { Account } from '../../src/accounts/models/account.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userId: string;
  const mockCreateUserInput = createUserFactory();

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

  it('/ User Resolver (query findAll)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Users {
          users {
            name,
            lastName
          }
        }`,
      })
      .expect(200);

    const { users } = response.body.data;

    expect(users[0]).toEqual({
      name: mockCreateUserInput.name,
      lastName: mockCreateUserInput.lastName,
    });
  });

  it('/ User Resolver (query findOne)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query($userId: String!){
          user(id: $userId) {
            name,
            lastName,
            nickName
          }
        }`,
        variables: { userId },
      })
      .expect(200);

    const { user } = response.body.data;

    expect(user).toEqual({
      name: mockCreateUserInput.name,
      lastName: mockCreateUserInput.lastName,
      nickName: mockCreateUserInput.nickName,
    });
  });

  it('/ User Resolver (mutation updateUser)', async () => {
    const mockUserUpdateUserInput = updateUserFactory({ id: userId });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($updateUserInput: UpdateUserInput!) {
          updateUser(updateUserInput: $updateUserInput) {
            name,
            lastName,
            nickName
          }
        }`,
        variables: { updateUserInput: mockUserUpdateUserInput },
      })
      .expect(200);

    const { updateUser } = response.body.data;

    expect(updateUser).toEqual({
      name: mockUserUpdateUserInput.name,
      lastName: mockUserUpdateUserInput.lastName,
      nickName: mockUserUpdateUserInput.nickName,
    });
  });

  it('/ User Resolver (mutation removeUser)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation RemoveUser($removeUserId: String!) {
          removeUser(id: $removeUserId) {
            id
          }
        }`,
        variables: { removeUserId: userId },
      })
      .expect(200);

    const { removeUser } = response.body.data;

    expect(removeUser).toEqual({ id: userId });
  });

  it('/ User Resolver (mutation recoverUser)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Recover($recoverUserId: String!) {
          recoverUser(id: $recoverUserId) { id }
        }`,
        variables: { recoverUserId: userId },
      })
      .expect(200);

    const { recoverUser } = response.body.data;

    expect(recoverUser).toEqual({ id: userId });
  });

  it('/ User Resolver (mutation recoverUser)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation RemoveUser($permanentRemoveUserId: String!) {
          permanentRemoveUser(id: $permanentRemoveUserId) {
            id,
          }
        }`,
        variables: { permanentRemoveUserId: userId },
      })
      .expect(200);

    const { permanentRemoveUser } = response.body.data;

    expect(permanentRemoveUser).toEqual({ id: userId });
  });
});
