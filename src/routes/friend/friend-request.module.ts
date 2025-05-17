import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
// import { FriendRequestController } from './friend-request.controller';
import { FriendRequestRepo } from './friend-request.repo';
import { FriendRequestGateway } from './friend-request.gateway';
import { AuthRepository } from '../auth/auth.repo';
import { FriendRequestController } from './friend-request.controller';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationRepo } from '../conversation/conversation.repo';
import { GroupRepo } from '../group/group.repo';

@Module({
  providers: [
    FriendRequestService,
    FriendRequestRepo,
    FriendRequestGateway,
    AuthRepository,
    ConversationService,
    ConversationRepo,
    GroupRepo
  ],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
