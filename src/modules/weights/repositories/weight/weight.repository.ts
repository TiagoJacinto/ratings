import { type Weight } from '../../domain/Weight';
import { type Weights } from '../../domain/Weights';

export interface WeightRepository {
  save(weight: Weight): Promise<void>;
  saveMany(weights: Weights): Promise<void>;
}
