import { Rating as RatingModel } from '@/database/entities/Rating';
import { Weights } from '@/modules/weights/domain/Weights';
import { TypeORMWeightMapper } from '@/modules/weights/mappers/TypeORMWeightMapper';

import { Rating } from '../domain/Rating';

export class TypeORMRatingMapper {
  static toPersistence(rating: Rating) {
    const model = new RatingModel({
      name: rating.name,
      description: rating.description,
      weights: rating.weights.getItems().map(TypeORMWeightMapper.toPersistence),
    });

    return model;
  }

  static toDomain(rating: RatingModel) {
    return Rating.create({
      name: rating.name,
      description: rating.description ?? undefined,
      weights: Weights.create(rating.weights.map(TypeORMWeightMapper.toDomain)),
    });
  }
}
