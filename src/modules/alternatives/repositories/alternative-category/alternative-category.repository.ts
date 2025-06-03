import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type AlternativeCategory } from '../../domain/AlternativeCategory';

export interface AlternativeCategoryRepository extends CrudRepository<AlternativeCategory, number> {
  existsByName(name: string): Promise<boolean>;
}
