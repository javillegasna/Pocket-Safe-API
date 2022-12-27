import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user';

import { User } from '../models/user.entity';
import { UsersService } from '../service/users.service';

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query((returns) => [User])
  users() {
    return this.userService.findAll();
  }

  @Query((returns) => User)
  user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findUserById(id);
  }

  @Mutation((returns) => User)
  createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.userService.createUser(userInput);
  }
}
