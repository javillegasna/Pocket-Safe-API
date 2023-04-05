import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TransactionsService } from '../service/transactions.service';
import { Transaction } from '../models/transaction.entity';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { UpdateTransactionInput } from '../dto/update-transaction.input';
import { Category } from 'src/categories/models/category.entity';
import { CategoriesService } from 'src/categories/service/categories.service';
import { AccountsService } from 'src/accounts/service/accounts.service';
import { TransactionType } from '../common/transactions.enums';
import { Account } from 'src/accounts/models/account.entity';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService: CategoriesService,
    private readonly accountsService: AccountsService,
  ) {}

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    let updatedAccount: Account;
    if (createTransactionInput.transactionType === TransactionType.INPUT) {
      updatedAccount = await this.accountsService.addIncomingAmount(
        createTransactionInput.accountId,
        createTransactionInput.amount,
      );
    }
    if (createTransactionInput.transactionType === TransactionType.OUTPUT) {
      updatedAccount = await this.accountsService.subtractOutgoingAmount(
        createTransactionInput.accountId,
        createTransactionInput.amount,
      );
    }
    return this.transactionsService.create(
      createTransactionInput,
      updatedAccount,
    );
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Mutation(() => Transaction)
  updateTransaction(
    @Args('updateTransactionInput')
    updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionsService.update(
      updateTransactionInput.id,
      updateTransactionInput,
    );
  }

  @ResolveField(() => Category)
  category(@Parent() transaction: Transaction): Promise<Category> {
    return this.categoriesService.findOne(transaction.categoryId);
  }

  @Mutation(() => Transaction)
  removeTransaction(@Args('id') id: string) {
    return this.transactionsService.remove(id);
  }

  @Mutation(() => Transaction)
  recoverTransaction(@Args('id') id: string) {
    return this.transactionsService.recover(id);
  }

  @Mutation(() => Transaction)
  permanentRemoveTransaction(@Args('id') id: string) {
    return this.transactionsService.permanentRemove(id);
  }
}
