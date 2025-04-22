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
import { ConversationRepo } from '../conversation/conversation.repo';
import { MessagesService } from '../messages/messages.service';
import { GroupRepo } from '../group/group.repo';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly tokenService: TokenService,
    private readonly conversationRepo: ConversationRepo,
    private readonly groupRepo: GroupRepo,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split('Bearer ')[1];
    const user = await this.tokenService.verifyAccessToken(token as string);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.user = user;

    // Join conversation rooms
    const conversations = await this.conversationRepo.getConversationList(
      user.userId,
    );
    conversations.forEach((convo) => {
      client.join(`conversation_${convo.id}`);
    });

    // Join group rooms
    const groups = await this.groupRepo.getGroupsForUser(user.userId);
    groups.forEach((group) => {
      client.join(`group_${group.id}`);
    });

    this.logger.log(
      `User ${user.userId} connected and joined ${conversations.length} conversations and ${groups.length} groups`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User ${client.data.user?.userId} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    data: {
      roomType: 'conversation' | 'group';
      roomId: number;
      content: string;
    },
  ) {
    const user = client.data.user as AccessTokenPayload;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    if (data.roomType === 'conversation') {
      const conversation = await this.conversationRepo.findConversationById(
        data.roomId,
      );
      const isAuthorized = await this.conversationRepo.isParticipant(
        user.userId,
        data.roomId,
      );
      if (!isAuthorized || !conversation) {
        client.emit('error', 'Not authorized to send message to this room');
        return;
      }
    } else if (data.roomType === 'group') {
      const group = await this.groupRepo.getGroupById(data.roomId);
      const isAuthorized = await this.groupRepo.isMember(
        user.userId,
        data.roomId,
      );
      if (!isAuthorized || !group) {
        client.emit('error', 'Not authorized to send message to this room');
        return;
      }
    }

    const message = await this.messagesService.sendMessage(
      data.roomId,
      user.userId,
      data.content,
    );

    this.server
      .to(`${data.roomType}_${data.roomId}`)
      .emit('newMessage', message);
  }
}
