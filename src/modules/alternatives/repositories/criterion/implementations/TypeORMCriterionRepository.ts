import { type DataSource, type Repository } from 'typeorm';

import { Criterion as CriterionModel } from '@/database/entities/Criterion';
import { type Criterion } from '@/modules/alternatives/domain/Criterion';
import { TypeORMCriterionMapper } from '@/modules/alternatives/mappers/TypeORMCriterionMapper';
import { type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type CriterionRepository } from '../criterion.repository';

export class TypeORMCriterionRepository implements CriterionRepository {
  private readonly criterion: Repository<CriterionModel>;
  constructor(orm: DataSource) {
    this.criterion = orm.getRepository(CriterionModel);
  }

  async findById<TRelations extends Partial<Record<'alternativeCategory', boolean>>>(
    id: number,
    relations?: TRelations,
  ) {
    const criterion = await this.criterion.findOne({
      relations,
      where: {
        id,
      },
    });

    if (!criterion) return null;

    return TypeORMCriterionMapper.toDomain(criterion) as EntityWithRelations<Criterion, TRelations>;
  }

  async findManyByAlternativeCategoryId(id: number) {
    const criteria = await this.criterion.find({
      relations: {
        alternativeCategory: true,
      },
      where: {
        alternativeCategory: {
          id,
        },
      },
    });

    return criteria.map(TypeORMCriterionMapper.toDomain);
  }

  async findAll() {
    const models = await this.criterion.find();
    return models.map(TypeORMCriterionMapper.toDomain);
  }

  count() {
    return this.criterion.count();
  }

  existsById(id: number) {
    return this.criterion.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.criterion.delete({ id });
  }

  async save(criterion: Criterion) {
    const model = TypeORMCriterionMapper.toPersistence(criterion);

    const createdModel = await this.criterion.save(model);
    return createdModel.id;
  }
}
