import { Weight as WeightModel } from '@/database/entities/Weight';

import { Weight } from '../domain/Weight';
import { WeightValue } from '../domain/WeightValue';

export class TypeORMWeightMapper {
  static toPersistence(weight: Weight) {
    const model = new WeightModel({
      name: weight.name,
      value: weight.value.value,
    });

    return model;
  }

  static toDomain(weight: WeightModel) {
    return Weight.create({
      name: weight.name,
      value: WeightValue.create({ value: weight.value }).unwrapped,
    });
  }
}
