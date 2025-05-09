import { z } from 'zod';

export const IdSchema = z.string().uuid().or(z.number().int().nonnegative());

export type Id = z.infer<typeof IdSchema>;
