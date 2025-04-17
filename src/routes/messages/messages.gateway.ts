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
import { MessagesService } from './messages.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly tokenService: TokenService,
    private readonly conversationRepo: ConversationRepo,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    console.log('run>>', client.handshake);
    const token = client.handshake.headers.authorization?.split('Bearer ')[1];
    console.log('token>>>', token);
    const user = await this.tokenService.verifyAccessToken(token as string);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.user = user;

    const conversations = await this.conversationRepo.getConversationList(
      user.userId,
    );
    conversations.forEach((convo) => {
      client.join(`conversation_${convo.id}`);
    });

    this.logger.log(
      `User ${user.userId} connected and joined ${conversations.length} conversations`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User ${client.data.user?.userId} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    data: { conversationId: number; content: string },
  ) {
    const user = client.data.user;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const message = await this.messagesService.sendMessage(
      data.conversationId,
      user.userId,
      data.content,
    );

    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('newMessage', message);
  }
}
