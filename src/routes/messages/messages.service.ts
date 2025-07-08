import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MessageRepo } from './messages.repo';
import { ConversationRepo } from '../conversation/conversation.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagesMongoRepo } from './messages.mongo.repo';
import { CreateMessageInput, MessageType } from './message.dto';
import { UserRepository } from '../user/user.repo';

@Injectable()
export class MessagesService {
  constructor(
    // private readonly messageRepo: MessageRepo,
    private readonly messageRepo: MessagesMongoRepo,
    private readonly userRepo: UserRepository,
    private readonly conversationRepo: ConversationRepo,
    @InjectModel('Message') private messageModel: Model<any>,
  ) {}

  async sendMessage(
    conversationId: number,
    sender: {
      sender_id: number;
      sender_name: string;
    },
    content: any,
  ) {
    // Kiểm tra quyền tham gia cuộc trò chuyện
    console.log('get message>>>>', conversationId);
    const isParticipant = await this.conversationRepo.isParticipant(
      sender.sender_id,
      conversationId,
    );
    if (!isParticipant) {
      throw new HttpException('User not a participant', HttpStatus.FORBIDDEN);
    }

    // Tạo tin nhắn
    // const message = await this.messageRepo.createMessage({
    // conversationId,
    // senderId,
    // content,
    // });
    const messageData: CreateMessageInput = {
      conversation_id: conversationId,
      sender,
      status: 'sent',
      is_deleted: false,
      sent_at: new Date(),
      received_at: null,
      seen_at: null,
      reply_to_id: null,
      ...content,
      //   _id: { type: Number, required: true },
      //       sender: {
      //         sender_name: { type: String, required: true },
      //         sender_id: { type: Number, required: true },
      //       },
      //       status: {
      //         type: String,
      //         enum: Object.values(MessageStatus),
      //         default: MessageStatus.Sent,
      //         required: true,
      //       },
      //       conversation_id: { type: Number, required: true },
      //       reply_to_id: { type: Number },
      //       is_deleted: { type: Boolean, default: false },
      //       sent_at: { type: Date },
      //       received_at: { type: Date },
      //       seen_at: { type: Date },
    };
    const message = await this.messageRepo.createMessage(messageData);

    // TODO: Mã hóa tin nhắn

    // Cập nhật Tin nhắn cuối cùng trong cuộc trò chuyện
    await this.conversationRepo.updateLastMessage(conversationId, message.messageId);

    return message;
  }

  async getMessages(conversationId: number, currentUserId: number) {
    // Kiểm tra quyền tham gia cuộc trò chuyện
    const isParticipant = await this.conversationRepo.isParticipant(
      currentUserId,
      conversationId,
    );
    if (!isParticipant) {
      throw new HttpException('User not a participant', HttpStatus.FORBIDDEN);
    }

    // Lấy danh sách tin nhắn
    const messages =
      await this.messageRepo.getMessagesByConversationId(conversationId);

    return messages;
  }

  async handleContentType(content: unknown) {
    if (!content || (content as MessageType).type === undefined) {
      throw new HttpException('Invalid content type', HttpStatus.BAD_REQUEST);
    }

    if ((content as MessageType).type === 'text') {
      return;
    }
  }
}
