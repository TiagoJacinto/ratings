import { type EntityRelations, type EntityWithRelations } from '@/shared/model/CrudRepository';

import { type Weight } from '../../../ratings/domain/Weight';

export interface WeightRepository {
  save(weight: Weight): Promise<void>;
  findManyByRatingId<TRelations extends EntityRelations<'criterion'>>(
    ratingId: number,
    relations?: TRelations,
  ): Promise<EntityWithRelations<Weight, TRelations>[]>;
}
