import { z } from 'zod';
import { ConversationSchema } from 'src/shared/models/shared-conversation.model';
import { createZodDto } from 'nestjs-zod';

// DTO cho việc tạo cuộc trò chuyện (request body)
export const CreateConversationBodySchema = z
  .object({
    isGroup: z.boolean().default(false),
    name: z.string().optional(),
    participantId: z.number(),
  })
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
  lastMessageContent: z.string().nullable(),
  participantsCount: z.number(),
});

export type CreateConversationBodyType = z.infer<
  typeof CreateConversationBodySchema
>;
export type ConversationResType = z.infer<typeof ConversationResSchema>;

export class CreateConversationBodyDTO extends createZodDto(
  CreateConversationBodySchema,
) {}
export class ConversationResDTO extends createZodDto(ConversationResSchema) {}
