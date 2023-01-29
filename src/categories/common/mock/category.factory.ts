import { faker } from '@faker-js/faker';
import { CreateCategoryInput } from 'src/categories/dto/create-category.input';
import { UpdateCategoryInput } from 'src/categories/dto/update-category.input';
import { Category } from 'src/categories/models/category.entity';
import { userFactory } from 'src/users/common/mock/user.factory';
import { User } from 'src/users/models/user.entity';

type ICreateCategory = Partial<CreateCategoryInput>;

interface ICategory extends ICreateCategory {
  id?: string;
  user?: User;
}

interface IUpdateCategory extends ICreateCategory {
  id?: string;
}

export function createCategoryFactory({ ...args }: ICreateCategory = {}) {
  const crateCategory: CreateCategoryInput = {
    categoryName: faker.commerce.product(),
    icon: faker.image.abstract(),
    userId: faker.datatype.uuid(),
    ...args,
  };
  return crateCategory;
}

export function categoryFactory({ ...args }: ICategory = {}) {
  const userId = faker.datatype.uuid();
  const createCategory = createCategoryFactory({ userId });
  const category: Category = {
    id: faker.datatype.uuid(),
    user: userFactory(),
    transactions: [],
    ...createCategory,
    ...args,
  };
  return category;
}

export function updateCategoryFactory({ ...args }: IUpdateCategory = {}) {
  const createCategory = createCategoryFactory();
  const updateCategory: UpdateCategoryInput = {
    id: faker.datatype.uuid(),
    ...createCategory,
    ...args,
  };
  return updateCategory;
}
