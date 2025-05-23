import { type Repository, type DataSource } from 'typeorm';

import { Weight as WeightModel } from '@/database/entities/Weight';
import { type Weight } from '@/modules/ratings/domain/Weight';
import { TypeORMWeightMapper } from '@/modules/ratings/mappers/TypeORMWeightMapper';
import { type EntityRelations, type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type WeightRepository } from '../weight.repository';

export class TypeORMWeightRepository implements WeightRepository {
  private readonly weight: Repository<WeightModel>;
  constructor(orm: DataSource) {
    this.weight = orm.getRepository(WeightModel);
  }

  async findManyByRatingId<TRelations extends EntityRelations<'criterion'>>(
    ratingId: number,
    relations?: TRelations,
  ) {
    const weights = await this.weight.find({
      relations,
      where: { rating: { id: ratingId } },
    });

    return weights.map(TypeORMWeightMapper.toDomain) as EntityWithRelations<Weight, TRelations>[];
  }

  async save(weight: Weight) {
    await this.weight.save(TypeORMWeightMapper.toPersistence(weight));
  }
}
