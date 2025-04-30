import { WatchedList } from '@/shared/domain/WatchedList';

import { type Weight } from './Weight';

export class Weights extends WatchedList<Weight> {
  private constructor(initialWeights?: Weight[]) {
    super(initialWeights);
  }

  compareItems(a: Weight, b: Weight): boolean {
    return a.equals(b);
  }

  static create(weights?: Weight[]) {
    return new this(weights);
  }
}
