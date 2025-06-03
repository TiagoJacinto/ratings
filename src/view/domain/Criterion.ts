import { z } from 'zod';

import { IdSchema } from './Id';

export const CriterionSchema = z.object({
  id: IdSchema,

  name: z.string().min(1, {
    message: 'Name is required',
  }),
  description: z.string().optional(),
});
export type Criterion = z.infer<typeof CriterionSchema>;
