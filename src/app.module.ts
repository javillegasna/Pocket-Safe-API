import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'pocketSafe.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js} '],
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
