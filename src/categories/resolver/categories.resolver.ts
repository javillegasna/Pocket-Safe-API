import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CategoriesService } from '../service/categories.service';
import { Category } from '../models/category.entity';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { UsersService } from 'src/users/service/users.service';
import { User } from 'src/users/models/user.entity';
import { Account } from 'src/accounts/models/account.entity';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @ResolveField(() => User)
  user(@Parent() category: Account): Promise<User> {
    return this.userService.findOne(category.userId);
  }

  @Mutation(() => Category)
  removeCategory(@Args('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Mutation(() => Category)
  recoverCategory(@Args('id') id: string) {
    return this.categoriesService.recover(id);
  }

  @Mutation(() => Category)
  permanentRemoveCategory(@Args('id') id: string) {
    return this.categoriesService.permanentRemove(id);
  }
}
