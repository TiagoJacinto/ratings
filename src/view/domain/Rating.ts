import { z } from 'zod';

import { WeightSchema } from './Weight';
import { IdSchema } from './Id';

export const RatingSchema = z
  .object({
    id: IdSchema,
    name: z.string(),
    description: z.string().optional(),
    weights: z.array(WeightSchema),
  })
  .readonly();

export type Rating = z.infer<typeof RatingSchema>;
