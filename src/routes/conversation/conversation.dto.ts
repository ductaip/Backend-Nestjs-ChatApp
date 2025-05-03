import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserResDTO } from '../user/user.dto';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { UserResSchema } from '../user/user.model';

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


export const ParticipantSchema = z.object({
  userId: z.number(),
  conversationId: z.number(),
  joinedAt: z.date(),
  isAdmin: z.boolean(),
  user: UserResSchema,
});

// DTO cho phản hồi cuộc trò chuyện (response)
export const ConversationResSchema = ConversationSchema.extend({
  lastMessage: z.unknown().nullable(),
  // lastMessage: z.string().nullable(),
  // participants: z.unknown().array(),
  participants: z.array(ParticipantSchema),
});

export type CreateConversationBodyType = z.infer<
  typeof CreateConversationBodySchema
>;
export type ConversationResType = z.infer<typeof ConversationResSchema>;

export class CreateConversationBodyDTO extends createZodDto(
  CreateConversationBodySchema,
) { }
export class ConversationResDTO extends createZodDto(ConversationResSchema) { }
