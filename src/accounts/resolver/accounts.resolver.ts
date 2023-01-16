import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AccountsService } from '../service/accounts.service';
import { UsersService } from 'src/users/service/users.service';
import { Account } from '../models/account.entity';
import { CreateAccountInput } from '../dto/create-account.input';
import { UpdateAccountInput } from '../dto/update-account.input';
import { User } from 'src/users/models/user.entity';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => Account)
  createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ) {
    return this.accountsService.create(createAccountInput);
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll() {
    return this.accountsService.findAll();
  }

  @Query(() => Account, { name: 'account' })
  findOne(@Args('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Mutation(() => Account)
  async updateAccount(
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput,
  ) {
    const updateResult = await this.accountsService.update(
      updateAccountInput.id,
      updateAccountInput,
    );
    return updateResult;
  }

  @ResolveField(() => User)
  user(@Parent() account: Account): Promise<User> {
    return this.userService.findOne(account.id);
  }

  @Mutation(() => Account)
  removeAccount(@Args('id') id: string) {
    return this.accountsService.remove(id);
  }

  @Mutation(() => Account)
  recoverAccount(@Args('id') id: string) {
    return this.accountsService.recover(id);
  }

  @Mutation(() => Account)
  permanentRemoveAccount(@Args('id') id: string) {
    return this.accountsService.permanentRemove(id);
  }
}
