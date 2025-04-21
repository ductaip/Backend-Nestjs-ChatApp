import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  adminId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GroupType = z.infer<typeof GroupSchema>;

export const CreateGroupBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const AddMemberBodySchema = z.object({
  userId: z.number(),
});

export const GroupResSchema = GroupSchema.extend({
  admin: z.object({
    id: z.number(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  members: z.array(
    z.object({
      userId: z.number(),
      role: z.string(),
      joinedAt: z.date(),
      user: z.object({
        id: z.number(),
        name: z.string(),
        avatarUrl: z.string().nullable(),
      }),
    }),
  ),
});

export type CreateGroupBodyType = z.infer<typeof CreateGroupBodySchema>;
export type AddMemberBodyType = z.infer<typeof AddMemberBodySchema>;
export type GroupResType = z.infer<typeof GroupResSchema>;

export class CreateGroupBodyDTO extends createZodDto(CreateGroupBodySchema) {}
export class AddMemberBodyDTO extends createZodDto(AddMemberBodySchema) {}
export class GroupResDTO extends createZodDto(GroupResSchema) {}
