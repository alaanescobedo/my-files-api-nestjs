import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/database/config';
import { Repository } from 'typeorm';
import Category from './category.entity';
import CreateCategoryDto from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import CategoryNotFoundException from './exceptions/category-not-found.exception';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) { }

  getAllCategories() {
    return this.categoriesRepository.find({
      relations: ['posts']
    });
  }

  async getCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['posts']
    });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(id);
  }

  async createCategory(category: CreateCategoryDto) {
    try {
      const newCategory = await this.categoriesRepository.create(category);
      await this.categoriesRepository.save(newCategory);
      return newCategory;
    }
    catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Category with that id already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updateCategory(id: number, category: UpdateCategoryDto) {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['posts']
    });
    if (updatedCategory) return updatedCategory
    
    throw new CategoryNotFoundException(id);
  }

  async deleteCategory(id: number) {
    const deleteResponse = await this.categoriesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
