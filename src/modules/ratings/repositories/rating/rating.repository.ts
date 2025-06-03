import { type SetNonNullableDeep } from 'type-fest';

import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Rating } from '../../domain/Rating';

export interface RatingRepository extends CrudRepository<Rating, number> {
  findManyByAlternativeCategoryIdForUpdate(
    id: number,
  ): Promise<SetNonNullableDeep<Rating, 'weights' | `weights.${number}.criterion`>[]>;
}
