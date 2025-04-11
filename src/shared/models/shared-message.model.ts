import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.number(),
  content: z.string(),
  senderId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  groupId: z.number().nullable(),
  conversationId: z.number().nullable(),
});

export type MessageType = z.infer<typeof MessageSchema>;
