import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FriendRequestRepo } from './friend-request.repo';

@Injectable()
export class FriendRequestService {
  constructor(private readonly friendRequestRepo: FriendRequestRepo) {}

  async sendRequest(senderId: number, receiverId: number) {
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

  async acceptRequest(requestId: number, receiverId: number) {
    const request = await this.friendRequestRepo.findRequestById(requestId);
    if (
      !request ||
      request.recipientId !== receiverId ||
      request.status !== 'pending'
    ) {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }
    return this.friendRequestRepo.acceptRequest(requestId, receiverId);
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
