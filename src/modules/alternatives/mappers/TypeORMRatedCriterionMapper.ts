import { RatedCriterion as RatedCriterionModel } from '@/database/entities/RatedCriterion';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { RatedCriterion } from '../domain/RatedCriterion';
import { RatedCriterionValue } from '../domain/RatedCriterionValue';
import { TypeORMCriterionMapper } from './TypeORMCriterionMapper';

export class TypeORMRatedCriterionMapper {
  static toPersistence(ratedCriterion: RatedCriterion) {
    const id = ratedCriterion.id.toValue();
    return new RatedCriterionModel({
      id: typeof id === 'number' ? id : undefined,
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
