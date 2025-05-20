import { z } from 'zod';

import { stepBy } from '@/lib/utils';

export namespace RatedCriterionValue {
  export const MIN = 0;
  export const MAX = 10;
  export const MAX_FRACTION_DIGITS = 1;
}

export const RatedCriterionValueSchema = z
  .number()
  .min(RatedCriterionValue.MIN)
  .max(RatedCriterionValue.MAX)
  .step(stepBy(RatedCriterionValue.MAX_FRACTION_DIGITS));
export type RatedCriterionValue = z.infer<typeof RatedCriterionValueSchema>;
