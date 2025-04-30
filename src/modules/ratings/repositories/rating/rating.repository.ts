import { type CrudRepository } from '@/shared/model/CrudRepository';

import { type Rating } from '../../domain/Rating';

export type RatingRepository = CrudRepository<Rating, number>;
