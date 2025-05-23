import {
  type EntityRelations,
  type EntityWithRelations,
  type CrudRepository,
} from '@/shared/model/CrudRepository';

import { type RatedCriterion } from '../../domain/RatedCriterion';

export interface RatedCriterionRepository
  extends CrudRepository<RatedCriterion, number, 'criterion'> {
  findManyByAlternativeId<TRelations extends EntityRelations<'criterion'>>(
    id: number,
    relations?: TRelations,
  ): Promise<EntityWithRelations<RatedCriterion, TRelations>[]>;
}
