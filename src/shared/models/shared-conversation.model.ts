import { z } from 'zod';

export const ConversationSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastMessageId: z.number().nullable(),
});

export type ConversationType = z.infer<typeof ConversationSchema>;
