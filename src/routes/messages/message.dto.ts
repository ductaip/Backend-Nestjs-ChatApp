import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

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

export const CreateMessageBodySchema = z.object({
  content: z.string().min(1),
  conversationId: z.number(),
  senderId: z.number(),
});

export const MessageResSchema = MessageSchema.extend({
  senderName: z.string(),
});

export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>;
export type MessageResType = z.infer<typeof MessageResSchema>;

export class CreateMessageBodyDTO extends createZodDto(
  CreateMessageBodySchema,
) {}
export class MessageResDTO extends createZodDto(MessageResSchema) {}
