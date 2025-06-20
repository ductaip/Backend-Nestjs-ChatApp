import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageRepo } from './messages.repo';
import { ChatGateway } from './messages.gateway';
import { ConversationRepo } from '../conversation/conversation.repo';
import { GroupRepo } from '../group/group.repo';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AudioMessageSchema,
  BaseMessageSchema,
  CallMessageSchema,
  FileMessageSchema,
  ImageMessageSchema,
  SystemMessageSchema,
  TextMessageSchema,
} from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Message',
        useFactory: () => {
          const base = BaseMessageSchema;

          base.discriminator('text', TextMessageSchema);
          base.discriminator('file', FileMessageSchema);
          base.discriminator('audio', AudioMessageSchema);
          base.discriminator('image', ImageMessageSchema);
          base.discriminator('system', SystemMessageSchema);
          base.discriminator('call', CallMessageSchema);

          return base;
        },
      },
    ]),
  ],
  providers: [
    MessagesService,
    MessageRepo,
    ChatGateway,
    ConversationRepo,
    GroupRepo,
  ],
  controllers: [MessagesController],
})
export class MessagesModule {}
