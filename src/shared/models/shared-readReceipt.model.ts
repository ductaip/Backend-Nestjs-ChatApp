import { z } from 'zod';

export const ReadReceiptSchema = z.object({
  userId: z.number(),
  messageId: z.number(),
  readAt: z.date(),
});

export type ReadReceiptType = z.infer<typeof ReadReceiptSchema>;
