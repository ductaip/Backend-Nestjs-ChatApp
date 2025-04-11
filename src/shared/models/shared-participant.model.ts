import { z } from 'zod';

export const ParticipantSchema = z.object({
  userId: z.number(),
  conversationId: z.number(),
  joinedAt: z.date(),
  isAdmin: z.boolean(),
});

export type ParticipantType = z.infer<typeof ParticipantSchema>;
