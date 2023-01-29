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

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.create(createTransactionInput);
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
