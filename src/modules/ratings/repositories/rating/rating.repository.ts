import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Rating } from '../../domain/Rating';

export interface RatingRepository
  extends CrudRepository<Rating, number, 'weights' | 'alternativeCategory'> {
  findManyByAlternativeCategoryId(id: number): Promise<Rating[]>;
}
