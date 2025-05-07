import { createZodDto } from "nestjs-zod";
import { FindUserResSchema, FriendsListSchema, GetProfileSchema, UserResSchema } from "./user.model";

export class UserResDTO extends createZodDto(UserResSchema) { }

export class GetUser extends createZodDto(GetProfileSchema) { }

export class FindUserResDTO extends createZodDto(FindUserResSchema) { }

export class FriendsListDTO extends createZodDto(FriendsListSchema) {}