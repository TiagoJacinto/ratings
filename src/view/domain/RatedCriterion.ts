import { z } from 'zod';

import { IdSchema } from './Id';
import { RatedCriterionValueSchema } from './RatedCriterionValue';

export const RatedCriterionSchema = z.object({
  id: IdSchema,
  criterionId: IdSchema,
  value: RatedCriterionValueSchema,
});
export type RatedCriterion = z.infer<typeof RatedCriterionSchema>;
