import { z } from 'zod';

export const GroupMemberSchema = z.object({
  userId: z.number(),
  groupId: z.number(),
  joinedAt: z.date(),
  role: z.string(),
});

export type GroupMemberType = z.infer<typeof GroupMemberSchema>;
