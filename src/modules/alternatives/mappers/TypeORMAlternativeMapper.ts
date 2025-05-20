import { Alternative as AlternativeModel } from '@/database/entities/Alternative';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { Alternative } from '../domain/Alternative';
import { TypeORMRatedCriterionMapper } from './TypeORMRatedCriterionMapper';
import { TypeORMAlternativeCategoryMapper } from './TypeORMAlternativeCategoryMapper';

export class TypeORMAlternativeMapper {
  static toPersistence(alternative: Alternative) {
    const id = alternative.id.toValue();

    return new AlternativeModel({
      id: typeof id === 'number' ? id : undefined,
      name: alternative.name,
      description: alternative.description,
      ratedCriteria: alternative.ratedCriteria.map(TypeORMRatedCriterionMapper.toPersistence),
    });
  }

  static toDomain(alternative: AlternativeModel) {
    return Alternative.create(
      {
        name: alternative.name,
        alternativeCategory: TypeORMAlternativeCategoryMapper.toDomain(
          alternative.alternativeCategory,
        ),
        description: alternative.description ?? undefined,
      },
      new UniqueEntityID(alternative.id),
    );
  }
}
