import { z } from 'zod';

import { IdSchema } from './Id';
import { RatedCriterionSchema } from './RatedCriterion';

export const AlternativeSchema = z.object({
  id: IdSchema,

  name: z.string().min(1, {
    message: 'Name is required',
  }),
  description: z.string().optional(),
  ratedCriteria: z.array(RatedCriterionSchema),
});

export type Alternative = z.infer<typeof AlternativeSchema>;
