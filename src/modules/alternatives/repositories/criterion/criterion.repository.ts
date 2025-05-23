import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Criterion } from '../../domain/Criterion';

export interface CriterionRepository
  extends CrudRepository<Criterion, number, 'alternativeCategory'> {
  findManyByAlternativeCategoryId(id: number): Promise<Criterion[]>;
}
