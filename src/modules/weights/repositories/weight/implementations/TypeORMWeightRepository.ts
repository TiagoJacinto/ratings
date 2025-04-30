import { Weight as WeightModel } from '@/database/entities/Weight';
import { type Weight } from '@/modules/weights/domain/Weight';
import { type Weights } from '@/modules/weights/domain/Weights';
import { TypeORMWeightMapper } from '@/modules/weights/mappers/TypeORMWeightMapper';
import { type Repository, type DataSource } from 'typeorm';

import { type WeightRepository } from '../weight.repository';

export class TypeORMWeightRepository implements WeightRepository {
  private readonly weight: Repository<WeightModel>;
  constructor(orm: DataSource) {
    this.weight = orm.getRepository(WeightModel);
  }

  async save(weight: Weight) {
    await this.weight.save(TypeORMWeightMapper.toPersistence(weight));
  }

  async saveMany(weights: Weights) {
    const weightsToDelete = weights
      .getRemovedItems()
      .map(TypeORMWeightMapper.toPersistence)
      .map((w) => w.id);
    if (weightsToDelete.length) await this.weight.delete(weightsToDelete);

    const weightsToSave = weights.getNewItems().map(TypeORMWeightMapper.toPersistence);
    if (weightsToSave.length) await this.weight.save(weightsToSave);
  }
}
