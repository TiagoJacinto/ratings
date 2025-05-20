import { z } from 'zod';

export const IdSchema = z.number().int();

export type Id = z.infer<typeof IdSchema>;
