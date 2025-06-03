import { z } from 'zod';

import { RatingSchema } from './Rating';
import { CriterionSchema } from './Criterion';
import { AlternativeSchema } from './Alternative';

export const AlternativeCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  alternatives: z.array(AlternativeSchema),
  criteria: z.array(CriterionSchema),
  description: z.string().optional(),
  ratings: z.array(RatingSchema),
});

export type AlternativeCategory = z.infer<typeof AlternativeCategorySchema>;
