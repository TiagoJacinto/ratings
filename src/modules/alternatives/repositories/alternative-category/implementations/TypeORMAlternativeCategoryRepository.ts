import { type DataSource, type Repository } from 'typeorm';

import { AlternativeCategory as AlternativeCategoryModel } from '@/database/entities/AlternativeCategory';
import { type AlternativeCategory } from '@/modules/alternatives/domain/AlternativeCategory';
import { TypeORMAlternativeCategoryMapper } from '@/modules/alternatives/mappers/TypeORMAlternativeCategoryMapper';
import { type EntityRelations, type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type AlternativeCategoryRepository } from '../alternative-category.repository';

export class TypeORMAlternativeCategoryRepository implements AlternativeCategoryRepository {
  private readonly alternativeCategory: Repository<AlternativeCategoryModel>;
  constructor(orm: DataSource) {
    this.alternativeCategory = orm.getRepository(AlternativeCategoryModel);
  }

  async findById<TRelations extends EntityRelations<'alternatives' | 'criteria' | 'ratings'>>(
    id: number,
    relations?: TRelations,
  ) {
    const alternativeCategory = await this.alternativeCategory.findOne({
      relations,
      where: {
        id,
      },
    });

    if (!alternativeCategory) return null;

    return TypeORMAlternativeCategoryMapper.toDomain(alternativeCategory) as EntityWithRelations<
      AlternativeCategory,
      TRelations
    >;
  }

  existsByName(name: string) {
    return this.alternativeCategory.existsBy({
      name,
    });
  }

  async findAll() {
    const models = await this.alternativeCategory.find();
    return models.map(TypeORMAlternativeCategoryMapper.toDomain);
  }

  count() {
    return this.alternativeCategory.count();
  }

  existsById(id: number) {
    return this.alternativeCategory.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.alternativeCategory.delete({ id });
  }

  async save(alternativeCategory: AlternativeCategory) {
    const model = TypeORMAlternativeCategoryMapper.toPersistence(alternativeCategory);

    const createdModel = await this.alternativeCategory.save(model);

    return createdModel.id;
  }
}
