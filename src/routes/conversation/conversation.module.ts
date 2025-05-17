import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationRepo } from './conversation.repo';
import { AuthRepository } from '../auth/auth.repo';
import { GroupRepo } from '../group/group.repo';

@Module({
  providers: [ConversationService, ConversationRepo, GroupRepo, AuthRepository],
  controllers: [ConversationController],
})
export class ConversationModule {}
