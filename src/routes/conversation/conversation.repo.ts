import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ConversationRepo {
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

  //find detail conversation
  // Kiểm tra cuộc trò chuyện đã tồn tại
  async findExistConversation(currentUserId: number, participantId: number) {
    return this.prismaService.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: {
              in: [currentUserId, participantId],
            },
          },
        },
      },
    });
  }

  //create new conversation
  async createConversation(
    currentUserId: number,
    participantId: number,
    name: string,
  ) {
    return this.prismaService.conversation.create({
      data: {
        isGroup: false,
        name,
        participants: {
          create: [
            { userId: currentUserId, isAdmin: false },
            { userId: participantId, isAdmin: false },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        lastMessage: true,
      },
    });
  }
}
