import { z } from 'zod';

import { WeightValueSchema } from './WeightValue';

export const WeightSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    value: WeightValueSchema,
  })
  .readonly();

export type Weight = z.infer<typeof WeightSchema>;
