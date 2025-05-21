import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupRepo } from './group.repo';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationRepo } from '../conversation/conversation.repo';
import { AuthRepository } from '../auth/auth.repo';
import { GroupGateway } from './group.gateway';
 
@Module({
  providers: [GroupService, GroupRepo, ConversationService, ConversationRepo, AuthRepository, GroupGateway],
  controllers: [GroupController],
})
export class GroupModule {}
