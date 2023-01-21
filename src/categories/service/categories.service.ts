import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryInput);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryRepository.save({
      id,
      ...updateCategoryInput,
    });
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    return this.categoryRepository.softRemove(category);
  }

  async recover(id: string) {
    await this.categoryRepository.restore(id);
    return this.categoryRepository.findOneBy({ id });
  }

  async permanentRemove(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    await this.categoryRepository.remove(category);
    return { ...category, id };
  }
}
