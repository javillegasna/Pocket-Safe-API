import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @MaxLength(15)
  @Field()
  categoryName: string;

  @IsNotEmpty()
  @Field()
  @MaxLength(15)
  icon: string;

  @IsNotEmpty()
  @Field()
  userId: string;
}
