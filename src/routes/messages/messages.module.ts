import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageRepo } from './messages.repo';
import { ChatGateway } from './messages.gateway';
import { ConversationRepo } from '../conversation/conversation.repo';

@Module({
  providers: [MessagesService, MessageRepo, ChatGateway, ConversationRepo],
  controllers: [MessagesController],
})
export class MessagesModule {}
