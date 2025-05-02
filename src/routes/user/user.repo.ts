import { Injectable } from "@nestjs/common";
import { UserType } from "src/shared/models/shared-user.model";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
export class UserRepository {
     constructor(private readonly prismaService: PrismaService) { }

     async findUniqueUser(
          where: { email: string } | { id: number },
     ): Promise<UserType | null> {
          return await this.prismaService.user.findUnique({
               where,
          },);
     }
}