import { type Weight } from '../../../ratings/domain/Weight';
import { type Weights } from '../../../ratings/domain/Weights';

export interface WeightRepository {
  save(weight: Weight): Promise<void>;
  saveMany(weights: Weights): Promise<void>;
  findManyByRatingId(ratingId: number): Promise<Weight[]>;
}
