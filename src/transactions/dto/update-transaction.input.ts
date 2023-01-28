import { CreateTransactionInput } from './create-transaction.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';
import { TransactionType } from '../common/transactions.enums';

@InputType()
export class UpdateTransactionInput extends PartialType(
  CreateTransactionInput,
) {
  @Field()
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  transactionType: TransactionType;

  @Field()
  categoryId: string;

  @Field()
  accountId: string;
}
