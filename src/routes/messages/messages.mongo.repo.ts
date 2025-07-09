import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageInput } from './message.dto';

@Injectable()
export class MessagesMongoRepo {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<any>,
  ) {}

  async createMessage(input: CreateMessageInput) {
    const id = await this.messageModel.countDocuments();
    const created = await this.messageModel.create({
      _id: new Types.ObjectId(),
      messageId: id + 1,
      ...input,
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
    });
    return created;
  }

  async getMessagesById(messageId: number) {
    return this.messageModel.findOne({ messageId: messageId }).exec();
  }

  async getMessagesByConversationId(convoId: number, limit = 50) {
    return this.messageModel
      .find({ conversation_id: convoId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getMessagesByConversationIds(convoIds: number[], limit = 50) {
    return this.messageModel
      .find({ conversation_id: { $in: convoIds } }) // lọc theo danh sách id
      .sort({ createdAt: -1 }) // sắp xếp mới -> cũ
      .limit(limit)
      .exec();
  }

  async deleteMessage(messageId: number) {
    return this.messageModel.findByIdAndDelete(messageId);
  }
}
