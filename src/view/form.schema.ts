import { z } from 'zod';

import { IdSchema } from './domain/Id';
import { RatedCriterionSchema } from './domain/RatedCriterion';
import { WeightSchema } from './domain/Weight';
import { CriterionSchema } from './domain/Criterion';

export const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  alternatives: z.array(
    z.object({
      id: IdSchema,

      name: z.string().min(1, {
        message: 'Name is required',
      }),
      description: z.string().optional(),
      ratedCriteria: z.array(RatedCriterionSchema),
    }),
  ),
  criteria: z.array(CriterionSchema),
  description: z.string().optional(),
  ratings: z.array(
    z.object({
      id: IdSchema,

      name: z.string().min(1, {
        message: 'Name is required',
      }),
      description: z.string().optional(),
      weights: z.array(WeightSchema),
    }),
  ),
});

export type FormSchema = z.infer<typeof formSchema>;
