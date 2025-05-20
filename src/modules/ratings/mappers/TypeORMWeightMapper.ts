import { Weight as WeightModel } from '@/database/entities/Weight';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { TypeORMCriterionMapper } from '@/modules/alternatives/mappers/TypeORMCriterionMapper';

import { Weight } from '../domain/Weight';
import { WeightValue } from '../domain/WeightValue';

export class TypeORMWeightMapper {
  static toPersistence(weight: Weight) {
    const id = weight.id.toValue();

    const model = new WeightModel({
      id: typeof id === 'number' ? id : undefined,
      criterion: weight.criterion && TypeORMCriterionMapper.toPersistence(weight.criterion),
      value: weight.value.value,
    });

    return model;
  }

  static toDomain(weight: WeightModel) {
    if (!weight.criterion) throw new Error('Weight must have a criterion');

    return Weight.create(
      {
        criterion: weight.criterion && TypeORMCriterionMapper.toDomain(weight.criterion),
        value: WeightValue.create({ value: weight.value }).unwrapped,
      },
      new UniqueEntityID(weight.id),
    );
  }
}
