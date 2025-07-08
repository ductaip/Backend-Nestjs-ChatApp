import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export enum MessageStatus {
  Sending = 'sending',
  Sent = 'sent',
  Received = 'received',
  Seen = 'seen',
}
export const MessageStatusEnum = z.nativeEnum(MessageStatus);

export const MessageSchema = z.object({
  // id: z.number(),
  sender: z.object({
    sender_name: z.string(),
    sender_id: z.number(),
  }),
  status: MessageStatusEnum.default(MessageStatus.Sent),
  conversation_id: z.number(),
  reply_to_id: z.number().optional(),
  is_deleted: z.boolean().default(false),
  sent_at: z.date().optional(),
  received_at: z.date().optional(),
  seen_at: z.date().optional(),
  type: z.string(), // discriminatorKey
  createdAt: z.date(),
  updatedAt: z.date(),
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

export const TextMessageSchema = MessageSchema.extend({
  type: z.literal('text'),
  content: z.string(),
});

export const FileMessageSchema = MessageSchema.extend({
  type: z.literal('file'),
  url: z.string(),
  size: z.number(),
  extension: z.string(),
});

export const AudioMessageSchema = MessageSchema.extend({
  type: z.literal('audio'),
  url: z.string(),
  long: z.number(),
  size: z.number(),
  extension: z.string(),
});

export const ImageMessageSchema = MessageSchema.extend({
  type: z.literal('image'),
  url: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
  extension: z.string(),
});

export const SystemMessageSchema = MessageSchema.extend({
  type: z.literal('system'),
  content: z.string(),
});

export const CallMessageSchema = MessageSchema.extend({
  type: z.literal('call'),
  media_type: z.enum(['voice', 'video']),
  duration: z.number(),
});

export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>;
export type MessageResType = z.infer<typeof MessageResSchema>;

export class CreateMessageBodyDTO extends createZodDto(
  CreateMessageBodySchema,
) {}
export class MessageResDTO extends createZodDto(MessageResSchema) {}

export const MessageUnionSchema = z.discriminatedUnion('type', [
  TextMessageSchema,
  FileMessageSchema,
  AudioMessageSchema,
  ImageMessageSchema,
  SystemMessageSchema,
  CallMessageSchema,
]);

export type MessageUnionType = z.infer<typeof MessageUnionSchema>;

export const CreateMessageBaseSchema = z.object({
  conversation_id: z.number(),
  sender: z.object({
    sender_id: z.number(),
    sender_name: z.string(),
  }),
  reply_to_id: z.number().optional(),
});

export const CreateTextMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('text'),
  content: z.string().min(1),
});

export const CreateFileMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('file'),
  url: z.string(),
  size: z.number(),
  extension: z.string(),
});

export const CreateAudioMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('audio'),
  url: z.string(),
  long: z.number(),
  size: z.number(),
  extension: z.string(),
});

export const CreateImageMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('image'),
  url: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
  extension: z.string(),
});

export const CreateSystemMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('system'),
  content: z.string(),
});

export const CreateCallMessageSchema = CreateMessageBaseSchema.extend({
  type: z.literal('call'),
  media_type: z.enum(['voice', 'video']),
  duration: z.number(),
});

export const CreateMessageUnionSchema = z.discriminatedUnion('type', [
  CreateTextMessageSchema,
  CreateFileMessageSchema,
  CreateAudioMessageSchema,
  CreateImageMessageSchema,
  CreateSystemMessageSchema,
  CreateCallMessageSchema,
]);

export type CreateMessageInput = z.infer<typeof CreateMessageUnionSchema>;
