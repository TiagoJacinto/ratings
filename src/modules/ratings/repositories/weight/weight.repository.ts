import { type Weight } from '../../../ratings/domain/Weight';

export interface WeightRepository {
  save(weight: Weight): Promise<void>;
  findManyByRatingId(ratingId: number): Promise<Weight[]>;
}
