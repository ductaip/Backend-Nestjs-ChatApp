import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class FriendRequestRepo {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(senderId: number, receiverId: number) {
    return this.prisma.friendRequest.create({
      data: {
        requesterId: senderId,
        recipientId: receiverId,
        status: 'pending',
      },
    });
  }

  async acceptRequest(requestId: number, receiverId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (
      !request ||
      request.recipientId !== receiverId ||
      request.status !== 'pending'
    ) {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }
    await this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });
    return this.prisma.friend.create({
      data: {
        userAId: request.requesterId,
        userBId: request.recipientId,
      },
    });
  }

  async rejectRequest(requestId: number, receiverId: number) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (
      !request ||
      request.recipientId !== receiverId ||
      request.status !== 'pending'
    ) {
      throw new HttpException('Invalid friend request', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });
  }

  async findPendingRequests(userId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        recipientId: userId,
        status: 'pending',
      },
    });
  }

  async findRequestById(id: number) {
    return this.prisma.friendRequest.findUnique({
      where: { id },
    });
  }

  async findExistingRequest(senderId: number, receiverId: number) {
    return this.prisma.friendRequest.findFirst({
      where: {
        requesterId: senderId,
        recipientId: receiverId,
        status: 'pending',
      },
    });
  }

  async checkExistingFriendship(userAId: number, userBId: number) {
    return this.prisma.friend.findFirst({
      where: {
        OR: [
          { userAId, userBId },
          { userAId: userBId, userBId: userAId },
        ],
      },
    });
  }
}
