import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const FriendRequestSchema = z.object({
  id: z.number(),
  requesterId: z.number(),
  recipientId: z.number(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FriendRequestType = z.infer<typeof FriendRequestSchema>;

export const CreateFriendRequestBodySchema = z.object({
  recipientEmail: z.string(),
});

export const UpdateFriendRequestBodySchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

export const FriendRequestResSchema = FriendRequestSchema.extend({
  requesterName: z.string(),
  requesterAvatarUrl: z.string().nullable(),
});

export type CreateFriendRequestBodyType = z.infer<
  typeof CreateFriendRequestBodySchema
>;
export type UpdateFriendRequestBodyType = z.infer<
  typeof UpdateFriendRequestBodySchema
>;
export type FriendRequestResType = z.infer<typeof FriendRequestResSchema>;

export class CreateFriendRequestBodyDTO extends createZodDto(
  CreateFriendRequestBodySchema,
) {}
export class UpdateFriendRequestBodyDTO extends createZodDto(
  UpdateFriendRequestBodySchema,
) {}
export class FriendRequestResDTO extends createZodDto(FriendRequestResSchema) {}
