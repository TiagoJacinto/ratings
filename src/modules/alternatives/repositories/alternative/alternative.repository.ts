import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Alternative } from '../../domain/Alternative';

export interface AlternativeRepository extends CrudRepository<Alternative, number> {
  findManyByAlternativeCategoryId(id: number): Promise<Alternative[]>;
}
