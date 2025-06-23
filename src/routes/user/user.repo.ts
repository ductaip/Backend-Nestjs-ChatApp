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

     async findFriend(
          where: { email: string } | { id: number },
          currentUserId: number
     ): Promise<UserType | null> {
          console.log(where);

          return await this.prismaService.user.findUnique({
               where,
               include: {
                    friendOf: {
                         where:
                              { userAId: currentUserId },
                    },
                    friends: {
                         where:
                              { userBId: currentUserId }

                    },
                    friendRequestsReceived: {
                         where: {
                              requesterId: currentUserId
                         }
                    }
               }
          },);
     }

     async getFriends(where: { email: string } | { id: number },
     ) {
          return await this.prismaService.user.findUnique({
               where,
               include: {
                    friends: {
                         include: {
                              // userA: true,
                              userB: true,
                         }
                    },
                    friendOf: {
                         include: {
                              userA: true,
                              // userB: true,
                         }
                    },
                    friendRequestsReceived: {
                         where:{
                              status: "pending"
                         },
                         include: {
                              requester: {
                                   omit: {
                                        password: true
                                   }
                              }
                         }
                    }
               }
          },);
     }

     async updateUser(params: {
          where: { id: number };
          data: { avatarUrl?: string };
     }): Promise<UserType> {
          return await this.prismaService.user.update(params);
     }
}