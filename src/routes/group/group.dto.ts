import { z } from 'zod';
import { GroupSchema } from 'src/shared/models/shared-group.model';
import { createZodDto } from 'nestjs-zod';

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
