import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { AccountType } from '../common/accounts.enums';

@InputType()
export class CreateAccountInput {
  @IsNotEmpty()
  @MaxLength(15)
  @Field()
  name: string;

  @Field()
  type: AccountType;

  @IsNotEmpty()
  @Field()
  @MaxLength(15)
  icon: string;

  @IsNotEmpty()
  @Field()
  userId: string;
}
