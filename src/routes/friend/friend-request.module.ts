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
import { MessagesModule } from '../messages/messages.module';
import { UserRepository } from '../user/user.repo';
import { FcmService } from 'src/shared/services/fcm.service';
import { SocketStateService } from 'src/shared/services/socket-state.service';

@Module({
  providers: [
    FriendRequestService,
    FriendRequestRepo,
    FriendRequestGateway,
    AuthRepository,
    ConversationService,
    ConversationRepo,
    GroupRepo,
    UserRepository,
    FcmService,
    SocketStateService,
  ],
  controllers: [FriendRequestController],
  imports: [MessagesModule],
})
export class FriendRequestModule {}
