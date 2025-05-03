import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MessageRepo } from './messages.repo';
import { ConversationRepo } from '../conversation/conversation.repo';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepo: MessageRepo,
    private readonly conversationRepo: ConversationRepo,
  ) { }

  async sendMessage(conversationId: number, senderId: number, content: string) {
    // Kiểm tra quyền tham gia cuộc trò chuyện
    console.log('get message>>>>', conversationId);
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

    // Cập nhật Tin nhắn cuối cùng trong cuộc trò chuyện
    await this.conversationRepo.updateLastMessage(conversationId, message.id);

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
