import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const sqliteConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'pocketSafe.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

const apolloConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault],
};

@Module({
  imports: [
    GraphQLModule.forRoot(apolloConfig),
    TypeOrmModule.forRoot(sqliteConfig),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
