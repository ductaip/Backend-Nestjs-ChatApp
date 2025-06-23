import { createZodDto } from "nestjs-zod";
import { FindUserResSchema, FriendsListSchema, GetProfileSchema, UserResSchema, UploadAvatarResSchema } from "./user.model";

export class UserResDTO extends createZodDto(UserResSchema) { }

export class GetUser extends createZodDto(GetProfileSchema) { }

export class FindUserResDTO extends createZodDto(FindUserResSchema) { }

export class FriendsListDTO extends createZodDto(FriendsListSchema) {}

export class UploadAvatarResDTO extends createZodDto(UploadAvatarResSchema) {}