import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationRepo } from './conversation.repo';
import { AuthRepository } from '../auth/auth.repo';
import { GroupRepo } from '../group/group.repo';
import { MessagesMongoRepo } from '../messages/messages.mongo.repo';
import { MessagesModule } from '../messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MessagesModule],
  providers: [
    ConversationService,
    ConversationRepo,
    GroupRepo,
    AuthRepository,
  ],
  controllers: [ConversationController],
}) 
export class ConversationModule {}
 