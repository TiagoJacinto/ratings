import { Weight as WeightModel } from '@/database/entities/Weight';
import { type Weight } from '@/modules/ratings/domain/Weight';
import { TypeORMWeightMapper } from '@/modules/ratings/mappers/TypeORMWeightMapper';
import { type Repository, type DataSource } from 'typeorm';

import { type WeightRepository } from '../weight.repository';

export class TypeORMWeightRepository implements WeightRepository {
  private readonly weight: Repository<WeightModel>;
  constructor(orm: DataSource) {
    this.weight = orm.getRepository(WeightModel);
  }

  async findManyByRatingId(ratingId: number) {
    const weights = await this.weight.find({ where: { rating: { id: ratingId } } });
    return weights.map(TypeORMWeightMapper.toDomain);
  }

  async save(weight: Weight) {
    await this.weight.save(TypeORMWeightMapper.toPersistence(weight));
  }
}
