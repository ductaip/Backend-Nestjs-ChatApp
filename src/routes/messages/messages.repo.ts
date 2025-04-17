import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class MessageRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDetailMessageOfConversation(conversationId: number) {
    return await this.prismaService.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  //create new conversation
  async createMessage(data: {
    content: string;
    senderId: number;
    conversationId: number;
  }) {
    return this.prismaService.message.create({
      data,
    });
  }

  async isParticipant(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        isGroup: false,
        participants: {
          some: {
            userId,
          },
        },
        id: conversationId,
      },
    });
    return !!conversation;
  }
}
