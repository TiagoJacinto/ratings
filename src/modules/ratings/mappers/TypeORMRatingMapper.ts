import { Rating as RatingModel } from '@/database/entities/Rating';
import { TypeORMWeightMapper } from '@/modules/ratings/mappers/TypeORMWeightMapper';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { TypeORMAlternativeCategoryMapper } from '@/modules/alternatives/mappers/TypeORMAlternativeCategoryMapper';

import { Rating } from '../domain/Rating';

export class TypeORMRatingMapper {
  static toPersistence(rating: Rating) {
    const id = rating.id.toValue();

    const model = new RatingModel({
      id: typeof id === 'number' ? id : undefined,
      name: rating.name,
      alternativeCategory:
        rating.alternativeCategory &&
        TypeORMAlternativeCategoryMapper.toPersistence(rating.alternativeCategory),
      description: rating.description,
      weights: rating.weights?.map(TypeORMWeightMapper.toPersistence),
    });

    return model;
  }

  static toDomain(rating: RatingModel) {
    return Rating.create(
      {
        name: rating.name,
        alternativeCategory:
          rating.alternativeCategory &&
          TypeORMAlternativeCategoryMapper.toDomain(rating.alternativeCategory),
        description: rating.description ?? undefined,
        weights: rating.weights?.map(TypeORMWeightMapper.toDomain),
      },
      new UniqueEntityID(rating.id),
    );
  }
}
