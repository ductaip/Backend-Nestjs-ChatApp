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

// DTO cho việc tạo nhóm (request body)
export const CreateGroupBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const GroupResSchema = GroupSchema.extend({
  membersCount: z.number(),
});

export type CreateGroupBodyType = z.infer<typeof CreateGroupBodySchema>;
export type GroupResType = z.infer<typeof GroupResSchema>;

export class CreateGroupBodyDTO extends createZodDto(CreateGroupBodySchema) {}
export class GroupResDTO extends createZodDto(GroupResSchema) {}
