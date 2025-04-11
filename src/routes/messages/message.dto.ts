import { z } from 'zod';
import { MessageSchema } from 'src/shared/models/shared-message.model';
import { createZodDto } from 'nestjs-zod';

export const CreateMessageBodySchema = z
  .object({
    content: z.string().min(1),
    conversationId: z.number().optional(),
    groupId: z.number().optional(),
  })
  .refine(
    (data) => data.conversationId !== undefined || data.groupId !== undefined,
    {
      message: 'Phải cung cấp conversationId hoặc groupId',
      path: ['conversationId', 'groupId'],
    },
  );

export const MessageResSchema = MessageSchema.extend({
  senderName: z.string(),
});

export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>;
export type MessageResType = z.infer<typeof MessageResSchema>;

export class CreateMessageBodyDTO extends createZodDto(
  CreateMessageBodySchema,
) {}
export class MessageResDTO extends createZodDto(MessageResSchema) {}
