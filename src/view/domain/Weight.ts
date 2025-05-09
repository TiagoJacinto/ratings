import { z } from 'zod';

import { WeightValueSchema } from './WeightValue';
import { IdSchema } from './Id';

export const WeightSchema = z.object({
  id: IdSchema,
  criterionId: IdSchema,
  value: WeightValueSchema,
});

export type Weight = z.infer<typeof WeightSchema>;
