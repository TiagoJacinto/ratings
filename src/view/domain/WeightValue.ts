import { stepBy } from '@/lib/utils';
import { z } from 'zod';

export namespace WeightValue {
  export const MIN = 0;
  export const MAX = 100;
  export const MAX_FRACTION_DIGITS = 1;
}

export const WeightValueSchema = z
  .number()
  .min(WeightValue.MIN)
  .max(WeightValue.MAX)
  .step(stepBy(WeightValue.MAX_FRACTION_DIGITS));
export type WeightValue = z.infer<typeof WeightValueSchema>;
