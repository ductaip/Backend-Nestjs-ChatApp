import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  //get all my conversations
  async getConversationList(userId: number) {
    return await this.prismaService.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
        isGroup: false,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        lastMessage: true,
      },
    });
  }
}
