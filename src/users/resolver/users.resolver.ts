import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Account } from 'src/accounts/models/account.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';

import { User } from '../models/user.entity';
import { UsersService } from '../service/users.service';
import { AccountsService } from 'src/accounts/service/accounts.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private userService: UsersService,
    private accountService: AccountsService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @ResolveField(() => [Account])
  accounts(@Parent() user: User): Promise<Account[]> {
    return this.accountService.findAllByUserId(user.id);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @Mutation(() => User)
  recoverUser(@Args('id') id: string) {
    return this.userService.recover(id);
  }

  @Mutation(() => User)
  permanentRemoveUser(@Args('id') id: string) {
    return this.userService.permanentRemove(id);
  }
}
