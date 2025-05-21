import { Alternative as AlternativeModel } from '@/database/entities/Alternative';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';
import { toTypeORMModelId } from '@/modules/shared/lib/toTypeORMModelId';

import { Alternative } from '../domain/Alternative';
import { TypeORMRatedCriterionMapper } from './TypeORMRatedCriterionMapper';
import { TypeORMAlternativeCategoryMapper } from './TypeORMAlternativeCategoryMapper';

export class TypeORMAlternativeMapper {
  static toPersistence(alternative: Alternative) {
    return new AlternativeModel({
      id: toTypeORMModelId(alternative.id),
      name: alternative.name,
      description: alternative.description,
      ratedCriteria: alternative.ratedCriteria?.map(TypeORMRatedCriterionMapper.toPersistence),
    });
  }

  static toDomain(alternative: AlternativeModel) {
    return Alternative.create(
      {
        name: alternative.name,
        alternativeCategory:
          alternative.alternativeCategory &&
          TypeORMAlternativeCategoryMapper.toDomain(alternative.alternativeCategory),
        description: alternative.description ?? undefined,
      },
      new UniqueEntityID(alternative.id),
    );
  }
}
