import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ConversationSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastMessageId: z.number().nullable(),
});

export type ConversationType = z.infer<typeof ConversationSchema>;

// DTO cho việc tạo cuộc trò chuyện (request body)
export const CreateConversationBodySchema = z
  .object({
    isGroup: z.boolean().default(false),
    participantId: z.number(),
    name: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.isGroup && !data.name) {
        return false;
      }
      return true;
    },
    {
      message: 'Tên là bắt buộc đối với cuộc trò chuyện nhóm',
      path: ['name'],
    },
  );

// DTO cho phản hồi cuộc trò chuyện (response)
export const ConversationResSchema = ConversationSchema.extend({
  lastMessage: z.string().nullable(),
});

export type CreateConversationBodyType = z.infer<
  typeof CreateConversationBodySchema
>;
export type ConversationResType = z.infer<typeof ConversationResSchema>;

export class CreateConversationBodyDTO extends createZodDto(
  CreateConversationBodySchema,
) {}
export class ConversationResDTO extends createZodDto(ConversationResSchema) {}
