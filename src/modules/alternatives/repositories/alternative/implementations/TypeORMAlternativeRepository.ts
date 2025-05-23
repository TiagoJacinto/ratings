import { type DataSource, type Repository } from 'typeorm';

import { Alternative as AlternativeModel } from '@/database/entities/Alternative';
import { type Alternative } from '@/modules/alternatives/domain/Alternative';
import { TypeORMAlternativeMapper } from '@/modules/alternatives/mappers/TypeORMAlternativeMapper';
import { type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type AlternativeRepository } from '../alternative.repository';

export class TypeORMAlternativeRepository implements AlternativeRepository {
  private readonly alternativeCategory: Repository<AlternativeModel>;
  constructor(orm: DataSource) {
    this.alternativeCategory = orm.getRepository(AlternativeModel);
  }

  async findById<
    TRelations extends Partial<Record<'ratedCriteria' | 'alternativeCategory', boolean>>,
  >(id: number, relations?: TRelations) {
    const alternativeCategory = await this.alternativeCategory.findOne({
      relations,
      where: {
        id,
      },
    });

    if (!alternativeCategory) return null;

    return TypeORMAlternativeMapper.toDomain(alternativeCategory) as EntityWithRelations<
      Alternative,
      TRelations
    >;
  }

  async findManyByAlternativeCategoryId(id: number) {
    const models = await this.alternativeCategory.find({
      relations: {
        alternativeCategory: true,
      },
      where: {
        alternativeCategory: {
          id,
        },
      },
    });
    return models.map(TypeORMAlternativeMapper.toDomain);
  }

  async findAll() {
    const models = await this.alternativeCategory.find();
    return models.map(TypeORMAlternativeMapper.toDomain);
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

  async save(alternativeCategory: Alternative) {
    const model = TypeORMAlternativeMapper.toPersistence(alternativeCategory);

    const createdModel = await this.alternativeCategory.save(model);
    return createdModel.id;
  }
}
