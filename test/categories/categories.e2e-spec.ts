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

import { CreateCategoryInput } from 'src/categories/dto/create-category.input';
import {
  createCategoryFactory,
  updateCategoryFactory,
} from 'src/categories/common/mock/category.factory';

describe('AccountModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let userId: string;
  let categoryId: string;
  let mockCreateCategory: CreateCategoryInput;

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

  it('/ Category Resolver (mutation create)', async () => {
    mockCreateCategory = createCategoryFactory({ userId });
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

  it('/ Category Resolver (query findAll)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Categories {
          categories {
            userId,
            categoryName,
            icon,
            id,
          }
        }`,
      })
      .expect(200);

    const { categories } = response.body.data;

    expect(categories.length).toBe(1);
    expect(categories[0]).toEqual({
      categoryName: mockCreateCategory.categoryName,
      icon: mockCreateCategory.icon,
      userId: mockCreateCategory.userId,
      id: categoryId,
    });
  });

  it('/ Category Resolver (query findOne)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query Categories($categoryId: String!) {
          category(id: $categoryId) {
            userId,
            categoryName,
            icon,
            id,
          }
        }`,
        variables: { categoryId },
      })
      .expect(200);

    const { category } = response.body.data;

    expect(category).toEqual({
      categoryName: mockCreateCategory.categoryName,
      icon: mockCreateCategory.icon,
      userId: mockCreateCategory.userId,
      id: categoryId,
    });
  });

  it('/ Category Resolver (mutation updateCategory)', async () => {
    const mockUpdateCategoryInput = updateCategoryFactory({
      id: categoryId,
      userId,
    });
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($updateCategoryInput: UpdateCategoryInput!) {
          updateCategory(updateCategoryInput: $updateCategoryInput) {
            userId,
            categoryName,
            icon,
            id,
          }
        }`,
        variables: { updateCategoryInput: mockUpdateCategoryInput },
      })
      .expect(200);

    const { updateCategory } = response.body.data;

    expect(updateCategory).toEqual({
      categoryName: mockUpdateCategoryInput.categoryName,
      icon: mockUpdateCategoryInput.icon,
      userId: mockUpdateCategoryInput.userId,
      id: mockUpdateCategoryInput.id,
    });
  });

  it('/ Category Resolver (mutation removeCategory)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation($removeCategoryId: String!){
          removeCategory(id: $removeCategoryId) {
            userId,
            id,
          }
        }`,
        variables: { removeCategoryId: categoryId },
      })
      .expect(200);

    const { removeCategory } = response.body.data;

    expect(removeCategory).toEqual({
      id: categoryId,
      userId,
    });
  });

  it('/ Category Resolver (mutation recoverCategory)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($recoverCategoryId: String!) {
          recoverCategory(id: $recoverCategoryId) {
            userId
            id
          }
        }`,
        variables: { recoverCategoryId: categoryId },
      })
      .expect(200);

    const { recoverCategory } = response.body.data;

    expect(recoverCategory).toEqual({
      id: categoryId,
      userId,
    });
  });

  it('/ Category Resolver (mutation permanentRemoveCategory)', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        mutation Mutation($permanentRemoveCategoryId: String!) {
          permanentRemoveCategory(id: $permanentRemoveCategoryId) {
            userId,
            id,
          }
        }`,
        variables: { permanentRemoveCategoryId: categoryId },
      })
      .expect(200);

    const { permanentRemoveCategory } = response.body.data;

    expect(permanentRemoveCategory).toEqual({
      id: categoryId,
      userId,
    });
  });
});
