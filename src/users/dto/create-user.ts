import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @MaxLength(15)
  @Field()
  name: string;

  @IsNotEmpty()
  @MaxLength(15)
  @Field()
  lastName: string;

  @Field({ nullable: true })
  nickName?: string;
}
