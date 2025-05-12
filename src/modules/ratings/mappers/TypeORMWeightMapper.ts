import { Weight as WeightModel } from '@/database/entities/Weight';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { Weight } from '../domain/Weight';
import { WeightValue } from '../domain/WeightValue';

export class TypeORMWeightMapper {
  static toPersistence(weight: Weight) {
    const id = weight.id.toValue();

    const model = new WeightModel({
      id: typeof id === 'number' ? id : undefined,
      name: weight.name,
      value: weight.value.value,
    });

    return model;
  }

  static toDomain(weight: WeightModel) {
    return Weight.create(
      {
        name: weight.name,
        value: WeightValue.create({ value: weight.value }).unwrapped,
      },
      new UniqueEntityID(weight.id),
    );
  }
}
