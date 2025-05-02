import { UserSchema } from "src/shared/models/shared-user.model";

export const UserResSchema = UserSchema.omit({
     password: true,
   });