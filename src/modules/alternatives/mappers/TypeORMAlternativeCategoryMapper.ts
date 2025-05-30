import { AlternativeCategory as AlternativeCategoryModel } from '@/database/entities/AlternativeCategory';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { TypeORMRatingMapper } from '@/modules/ratings/mappers/TypeORMRatingMapper';
import { toTypeORMModelId } from '@/modules/shared/lib/toTypeORMModelId';

import { AlternativeCategory } from '../domain/AlternativeCategory';
import { TypeORMAlternativeMapper } from './TypeORMAlternativeMapper';
import { TypeORMCriterionMapper } from './TypeORMCriterionMapper';

export class TypeORMAlternativeCategoryMapper {
  static toPersistence(alternativeCategory: AlternativeCategory): AlternativeCategoryModel {
    return new AlternativeCategoryModel({
      id: toTypeORMModelId(alternativeCategory.id),
      name: alternativeCategory.name,
      alternatives: alternativeCategory.alternatives?.map(TypeORMAlternativeMapper.toPersistence),
      criteria: alternativeCategory.criteria?.map(TypeORMCriterionMapper.toPersistence),
      description: alternativeCategory.description,
      ratings: alternativeCategory.ratings?.map(TypeORMRatingMapper.toPersistence),
    });
  }

  static toDomain(alternativeCategory: AlternativeCategoryModel): AlternativeCategory {
    return AlternativeCategory.create(
      {
        name: alternativeCategory.name,
        alternatives: alternativeCategory.alternatives?.map(TypeORMAlternativeMapper.toDomain),
        criteria: alternativeCategory.criteria?.map(TypeORMCriterionMapper.toDomain),
        description: alternativeCategory.description ?? undefined,
        ratings: alternativeCategory.ratings?.map(TypeORMRatingMapper.toDomain),
      },
      new UniqueEntityID(alternativeCategory.id),
    );
  }
}
