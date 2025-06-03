import { z } from 'zod';

import { IdSchema } from './Id';
import { RatedCriterionValueSchema } from './RatedCriterionValue';
import { CriterionSchema } from './Criterion';

export const RatedCriterionSchema = z.object({
  id: IdSchema,
  criterion: CriterionSchema,
  value: RatedCriterionValueSchema,
});
export type RatedCriterion = z.infer<typeof RatedCriterionSchema>;
