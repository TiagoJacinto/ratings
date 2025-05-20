import { Criterion as CriterionModel } from '@/database/entities/Criterion';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityId';

import { Criterion } from '../domain/Criterion';
import { TypeORMAlternativeCategoryMapper } from './TypeORMAlternativeCategoryMapper';

export class TypeORMCriterionMapper {
  static toPersistence(criterion: Criterion) {
    const id = criterion.id.toValue();

    return new CriterionModel({
      id: typeof id === 'number' ? id : undefined,
      name: criterion.name,
      alternativeCategory:
        criterion.alternativeCategory &&
        TypeORMAlternativeCategoryMapper.toPersistence(criterion.alternativeCategory),
      description: criterion.description,
    });
  }

  static toDomain(criterion: CriterionModel) {
    return Criterion.create(
      {
        name: criterion.name,
        alternativeCategory:
          criterion.alternativeCategory &&
          TypeORMAlternativeCategoryMapper.toDomain(criterion.alternativeCategory),
        description: criterion.description ?? undefined,
      },
      new UniqueEntityID(criterion.id),
    );
  }
}
