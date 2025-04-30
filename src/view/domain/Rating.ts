import { z } from 'zod';

import { WeightSchema } from './Weight';

export const RatingSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    weights: z.array(WeightSchema),
  })
  .readonly();

export type Rating = z.infer<typeof RatingSchema>;
