import { InputType, Field, Float } from '@nestjs/graphql';
import { TransactionType } from '../common/transactions.enums';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount: number;

  @Field()
  transactionType: TransactionType;

  @Field()
  categoryId: string;

  @Field()
  accountId: string;
}
