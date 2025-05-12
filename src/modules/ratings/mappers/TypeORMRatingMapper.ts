import { Rating as RatingModel } from '@/database/entities/Rating';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { Rating } from '../domain/Rating';
import { TypeORMWeightMapper } from './TypeORMWeightMapper';

export class TypeORMRatingMapper {
  static toPersistence(rating: Rating) {
    const model = new RatingModel({
      name: rating.name,
      description: rating.description,
      weights: rating.weights.map(TypeORMWeightMapper.toPersistence),
    });

    return model;
  }

  static toDomain(rating: RatingModel) {
    return Rating.create(
      {
        name: rating.name,
        description: rating.description ?? undefined,
      },
      new UniqueEntityID(rating.id),
    );
  }
}
