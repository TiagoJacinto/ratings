import { type DataSource, type Repository } from 'typeorm';

import { RatedCriterion as RatedCriterionModel } from '@/database/entities/RatedCriterion';
import { type RatedCriterion } from '@/modules/alternatives/domain/RatedCriterion';
import { TypeORMRatedCriterionMapper } from '@/modules/alternatives/mappers/TypeORMRatedCriterionMapper';
import { type EntityRelations, type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type RatedCriterionRepository } from '../rated-criterion.repository';

export class TypeORMRatedCriterionRepository implements RatedCriterionRepository {
  private readonly ratedCriterion: Repository<RatedCriterionModel>;

  constructor(orm: DataSource) {
    this.ratedCriterion = orm.getRepository(RatedCriterionModel);
  }

  async findManyByAlternativeId<TRelations extends EntityRelations<'criterion'>>(
    id: number,
    relations?: TRelations,
  ) {
    const models = await this.ratedCriterion.find({
      relations,
      where: {
        alternative: {
          id,
        },
      },
    });
    return models.map(TypeORMRatedCriterionMapper.toDomain) as EntityWithRelations<
      RatedCriterion,
      TRelations
    >[];
  }

  async findById<TRelations extends EntityRelations<'criterion'>>(
    id: number,
    relations?: TRelations,
  ) {
    const ratedCriterion = await this.ratedCriterion.findOne({
      relations,
      where: {
        id,
      },
    });
    if (!ratedCriterion) return null;
    return TypeORMRatedCriterionMapper.toDomain(ratedCriterion) as EntityWithRelations<
      RatedCriterion,
      TRelations
    >;
  }

  async findAll() {
    const models = await this.ratedCriterion.find({
      relations: {
        criterion: true,
      },
    });
    return models.map(TypeORMRatedCriterionMapper.toDomain);
  }

  count() {
    return this.ratedCriterion.count();
  }

  existsById(id: number) {
    return this.ratedCriterion.existsBy({ id });
  }

  async deleteById(id: number) {
    await this.ratedCriterion.delete({ id });
  }

  async save(ratedCriterion: RatedCriterion) {
    const model = TypeORMRatedCriterionMapper.toPersistence(ratedCriterion);

    const createdModel = await this.ratedCriterion.save(model);
    return createdModel.id;
  }
}
