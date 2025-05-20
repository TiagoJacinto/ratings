import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type RatedCriterion } from '../../domain/RatedCriterion';

export interface RatedCriterionRepository extends CrudRepository<RatedCriterion, number> {
  findManyByAlternativeId(id: number): Promise<RatedCriterion[]>;
}
