import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TokenService } from 'src/shared/services/token.service';
import { FriendRequestService } from './friend-request.service';

@WebSocketGateway()
export class FriendRequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('FriendRequestGateway');

  constructor(
    private readonly tokenService: TokenService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split('Bearer ')[1];
      const user = await this.tokenService.verifyAccessToken(token as string);
      if (!user) {
        client.disconnect();
        return;
      }
      client.data.user = user;
      client.join(`user_${user.userId}`);
      this.logger.log(`User ${user.userId} connected to FriendRequestGateway`);
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      client.emit('error', { message: 'Invalid or malformed token' });
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User ${client.data.user?.userId} disconnected`);
  }

  @SubscribeMessage('sendFriendRequest')
  async handleSendFriendRequest(
    client: Socket,
    data: { recipientEmail: string },
  ) {
    const user = client.data.user;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }
    console.log('>>receiver', data.recipientEmail);
    const request = await this.friendRequestService.sendRequest(
      user.userId,
      data.recipientEmail,
    );
    this.server
      .to(`user_${request?.recipientId}`)
      .emit('friendRequestReceived', request);
  }

  @SubscribeMessage('acceptFriendRequest')
  async handleAcceptFriendRequest(client: Socket, data: { requestId: number }) {
    const user = client.data.user;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const request = await this.friendRequestService.getRequestById(
      data.requestId,
    );

    console.log(
      'accept friend request run ',
      request.recipientId,
      request.requesterId,
    );

    if (!request || request.recipientId !== user.userId) {
      client.emit('error', 'Invalid request');
      return;
    }

    const friendship = await this.friendRequestService.acceptRequest(
      data.requestId,
      user.userId,
    );

    this.server
      .to([`user_${request.requesterId}`, `user_${request.recipientId}`])
      .emit('friendRequestAccepted', friendship);
  }

  @SubscribeMessage('rejectFriendRequest')
  async handleRejectFriendRequest(client: Socket, data: { requestId: number }) {
    const user = client.data.user;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }
    const request = await this.friendRequestService.getRequestById(
      data.requestId,
    );
    if (!request || request.recipientId !== user.userId) {
      client.emit('error', 'Invalid request');
      return;
    }
    await this.friendRequestService.rejectRequest(data.requestId, user.userId);
    this.server
      .to(`user_${request.requesterId}`)
      .emit('friendRequestRejected', request);
  }
}
