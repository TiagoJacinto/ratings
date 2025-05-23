import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type AlternativeCategory } from '../../domain/AlternativeCategory';

export interface AlternativeCategoryRepository
  extends CrudRepository<AlternativeCategory, number, 'alternatives' | 'criteria' | 'ratings'> {
  existsByName(name: string): Promise<boolean>;
}
