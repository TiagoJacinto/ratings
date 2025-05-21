import { RatedCriterion as RatedCriterionModel } from '@/database/entities/RatedCriterion';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { toTypeORMModelId } from '@/modules/shared/lib/toTypeORMModelId';

import { RatedCriterion } from '../domain/RatedCriterion';
import { RatedCriterionValue } from '../domain/RatedCriterionValue';
import { TypeORMCriterionMapper } from './TypeORMCriterionMapper';

export class TypeORMRatedCriterionMapper {
  static toPersistence(ratedCriterion: RatedCriterion) {
    return new RatedCriterionModel({
      id: toTypeORMModelId(ratedCriterion.id),
      criterion:
        ratedCriterion.criterion && TypeORMCriterionMapper.toPersistence(ratedCriterion.criterion),
      value: ratedCriterion.value.value,
    });
  }

  static toDomain(ratedCriterion: RatedCriterionModel) {
    return RatedCriterion.create(
      {
        criterion:
          ratedCriterion.criterion && TypeORMCriterionMapper.toDomain(ratedCriterion.criterion),
        value: RatedCriterionValue.create({
          value: ratedCriterion.value,
        }).unwrapped,
      },
      new UniqueEntityID(ratedCriterion.id),
    );
  }
}
