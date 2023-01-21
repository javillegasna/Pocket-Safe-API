import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  categoryName?: string;

  @Field({ nullable: true })
  icon?: string;
}
