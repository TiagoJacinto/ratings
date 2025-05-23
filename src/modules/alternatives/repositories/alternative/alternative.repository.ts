import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Alternative } from '../../domain/Alternative';

export interface AlternativeRepository
  extends CrudRepository<Alternative, number, 'ratedCriteria' | 'alternativeCategory'> {
  findManyByAlternativeCategoryId(id: number): Promise<Alternative[]>;
}
