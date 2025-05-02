import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ConversationRepo {
  constructor(private readonly prismaService: PrismaService) {}

  // Lấy danh sách các cuộc trò chuyện của người dùng
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

  // Tìm cuộc trò chuyện đã tồn tại giữa hai người dùng
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

  // Tạo cuộc trò chuyện mới
  async createConversation(currentUserId: number, participantId: number) {
    return this.prismaService.conversation.create({
      data: {
        isGroup: false,
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

  // Kiểm tra người dùng có phải là thành viên của cuộc trò chuyện
  async isParticipant(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
        isGroup: false,
        participants: {
          some: {
            userId,
          },
        },
      },
    });
    return !!conversation;
  }

  // Tìm cuộc trò chuyện theo ID
  async findConversationById(conversationId: number) {
    return this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
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
