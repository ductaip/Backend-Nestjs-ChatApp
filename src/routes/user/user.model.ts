import { UserSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const UserResSchema = UserSchema.omit({
  password: true,
});

export const GetProfileSchema = UserSchema.pick({
  email: true
})

export const FriendSchema = z.object({
  userAId: z.number(),
  userBId: z.number(),
  createdAt: z.date(),
  userA: UserResSchema.extend({ avatarUrl: z.string().nullable() }).optional(),
  userB: UserResSchema.extend({ avatarUrl: z.string().nullable() }).optional(),
})

export const FindUserResSchema = UserResSchema.extend({
  avatarUrl: z.string().nullable(),
  friends: z.unknown().array().optional(),
  friendOf: z.unknown().array().optional(),
  friendRequestsReceived: z.unknown().array().optional(),
})

export const FriendsListSchema = z.object({
  friends: FriendSchema.array().transform((friends) =>
    friends.map(f =>
    ({
      ...f.userB
    })
    )
  ),
  friendOf: FriendSchema.array().transform((friends) =>
    friends.map(f =>
    ({
      ...f.userA
    })
    )
  ),
  friendRequestsReceived: z.unknown().array().optional(),
}).transform((val) => ({
  friendRequestsReceived: val.friendRequestsReceived,
  friends: [...val.friendOf, ...val.friends]
}))

export const UploadAvatarResSchema = z.object({
  success: z.boolean(),
  avatarUrl: z.string(),
  message: z.string(),
})
