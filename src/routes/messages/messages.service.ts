import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MessageRepo } from './messages.repo';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepo: MessageRepo) {}

  async sendMessage(conversationId: number, senderId: number, content: string) {
    // Kiểm tra quyền tham gia cuộc trò chuyện
    const isParticipant = await this.messageRepo.isParticipant(
      senderId,
      conversationId,
    );
    if (!isParticipant) {
      throw new HttpException('User not a participant', HttpStatus.FORBIDDEN);
    }

    // Tạo tin nhắn
    const message = await this.messageRepo.createMessage({
      conversationId,
      senderId,
      content,
    });

    return message;
  }

  async getMessages(conversationId: number, currentUserId: number) {
    // Kiểm tra quyền tham gia cuộc trò chuyện
    const isParticipant = await this.messageRepo.isParticipant(
      currentUserId,
      conversationId,
    );
    if (!isParticipant) {
      throw new HttpException('User not a participant', HttpStatus.FORBIDDEN);
    }

    // Lấy danh sách tin nhắn
    const messages =
      await this.messageRepo.getAllDetailMessageOfConversation(conversationId);

    return messages;
  }
}
