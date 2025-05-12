import { Rating as RatingModel } from '@/database/entities/Rating';
import { TypeORMWeightMapper } from '@/modules/ratings/mappers/TypeORMWeightMapper';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { Rating } from '../domain/Rating';

export class TypeORMRatingMapper {
  static toPersistence(rating: Rating) {
    const id = rating.id.toValue();

    const model = new RatingModel({
      id: typeof id === 'number' ? id : undefined,
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
