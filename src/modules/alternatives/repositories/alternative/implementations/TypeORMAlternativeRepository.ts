import { type DataSource, type Repository } from 'typeorm';
import { type SetNonNullableDeep } from 'type-fest';

import { Alternative as AlternativeModel } from '@/database/entities/Alternative';
import { type Alternative } from '@/modules/alternatives/domain/Alternative';
import { TypeORMAlternativeMapper } from '@/modules/alternatives/mappers/TypeORMAlternativeMapper';

import { type AlternativeRepository } from '../alternative.repository';

export class TypeORMAlternativeRepository implements AlternativeRepository {
  private readonly alternativeCategory: Repository<AlternativeModel>;
  constructor(orm: DataSource) {
    this.alternativeCategory = orm.getRepository(AlternativeModel);
  }

  async findManyByAlternativeCategoryIdForUpdate(id: number) {
    const models = await this.alternativeCategory.find({
      relations: {
        ratedCriteria: {
          criterion: true,
        },
      },
      where: {
        alternativeCategory: {
          id,
        },
      },
    });
    return models.map(TypeORMAlternativeMapper.toDomain) as SetNonNullableDeep<
      Alternative,
      'ratedCriteria' | `ratedCriteria.${number}.criterion`
    >[];
  }

  async findById(id: number) {
    const alternativeCategory = await this.alternativeCategory.findOneBy({
      id,
    });
    if (!alternativeCategory) return null;
    return TypeORMAlternativeMapper.toDomain(alternativeCategory);
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
