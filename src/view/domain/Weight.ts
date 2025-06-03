import { z } from 'zod';

import { WeightValueSchema } from './WeightValue';
import { IdSchema } from './Id';
import { CriterionSchema } from './Criterion';

export const WeightSchema = z.object({
  id: IdSchema,
  criterion: CriterionSchema,
  value: WeightValueSchema,
});

export type Weight = z.infer<typeof WeightSchema>;
