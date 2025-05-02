import { WatchedList } from '@/shared/domain/WatchedList';

import { type Weight } from './Weight';

export class Weights extends WatchedList<Weight> {
  static create(weights?: Weight[]) {
    return new this(weights);
  }

  compareItems(a: Weight, b: Weight): boolean {
    return a.equals(b);
  }
}
