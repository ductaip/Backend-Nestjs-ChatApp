import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
// import { FriendRequestController } from './friend-request.controller';
import { FriendRequestRepo } from './friend-request.repo';
import { FriendRequestGateway } from './friend-request.gateway';

@Module({
  providers: [FriendRequestService, FriendRequestRepo, FriendRequestGateway],
  controllers: [],
})
export class FriendRequestModule {}
