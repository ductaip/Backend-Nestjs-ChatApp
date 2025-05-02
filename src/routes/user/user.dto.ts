import { createZodDto } from "nestjs-zod";
import { UserResSchema } from "./user.model";

export class UserResDTO extends createZodDto(UserResSchema) { }


