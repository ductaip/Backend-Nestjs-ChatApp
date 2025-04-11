import { z } from 'zod';

export const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  adminId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GroupType = z.infer<typeof GroupSchema>;
