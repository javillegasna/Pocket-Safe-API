import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';

import { Category } from './models/category.entity';
import { CategoriesService } from './service/categories.service';
import { CategoriesResolver } from './resolver/categories.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => UsersModule),
  ],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
