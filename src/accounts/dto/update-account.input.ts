import { InputType, Field, PartialType, Float } from '@nestjs/graphql';
import { AccountType } from '../common/accounts.enums';
import { CreateAccountInput } from './create-account.input';

@InputType()
export class UpdateAccountInput extends PartialType(CreateAccountInput) {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => Float)
  totalAmount?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: AccountType;

  @Field({ nullable: true })
  icon?: string;
}
