import { type SetNonNullableDeep } from 'type-fest';

import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Alternative } from '../../domain/Alternative';

export interface AlternativeRepository extends CrudRepository<Alternative, number> {
  findManyByAlternativeCategoryIdForUpdate(
    id: number,
  ): Promise<
    SetNonNullableDeep<Alternative, 'ratedCriteria' | `ratedCriteria.${number}.criterion`>[]
  >;
}
