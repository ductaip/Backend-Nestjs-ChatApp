import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FriendRequestRepo } from './friend-request.repo';
import { AuthRepository } from '../auth/auth.repo';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly conservationService: ConversationService,
    private readonly friendRequestRepo: FriendRequestRepo,
    private readonly authRepository: AuthRepository,
  ) { }

  async sendRequest(senderId: number, recipientEmail: string) {
    const recipient = await this.authRepository.findUniqueUser({
      email: recipientEmail,
    });
    if (recipient && recipient.id) {
      const receiverId = recipient.id;
      if (senderId === receiverId) {
        throw new HttpException(
          'Cannot send friend request to yourself',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingRequest = await this.friendRequestRepo.findExistingRequest(
        senderId,
        receiverId,
      );
      if (existingRequest) {
        throw new HttpException(
          'Friend request already sent',
          HttpStatus.BAD_REQUEST,
        );
      }

      const friendship = await this.friendRequestRepo.checkExistingFriendship(
        senderId,
        receiverId,
      );
      if (friendship) {
        throw new HttpException('Already friends', HttpStatus.BAD_REQUEST);
      }

      return this.friendRequestRepo.createRequest(senderId, receiverId);
    }
  }

  async acceptRequest(requestId: number, receiverId: number) {
    const request = await this.friendRequestRepo.findRequestById(requestId);
    if (
      !request ||
      request.recipientId !== receiverId ||
      request.status !== 'pending'
    ) {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }


    const response = await this.friendRequestRepo.acceptRequest(requestId, receiverId);
    const { userAId, userBId } = response;

    // Create conversation
    const conversation = await this.conservationService.createConversation(userAId, userBId);

    return { ...response, conversationId: conversation.id };
  }

  async rejectRequest(requestId: number, receiverId: number) {
    const request = await this.friendRequestRepo.findRequestById(requestId);
    if (
      !request ||
      request.recipientId !== receiverId ||
      request.status !== 'pending'
    ) {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }
    return this.friendRequestRepo.rejectRequest(requestId, receiverId);
  }

  async getRequestById(requestId: number) {
    const request = await this.friendRequestRepo.findRequestById(requestId);
    if (!request) {
      throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);
    }
    return request;
  }

  async getPendingRequests(userId: number) {
    return await this.friendRequestRepo.findPendingRequests(userId);
  }
}
