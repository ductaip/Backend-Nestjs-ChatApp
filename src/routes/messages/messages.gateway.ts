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
import { escape } from 'querystring';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly tokenService: TokenService,
    private readonly conversationRepo: ConversationRepo,
    private readonly groupRepo: GroupRepo,
    private readonly messagesService: MessagesService,
  ) { }

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
      if (!convo.isGroup) {
        client.join(`conversation_${convo.id}`);
      }
      else {
        client.join(`group_${convo.id}`);
      }
    })

    // Join group rooms
    const groups = await this.groupRepo.getGroupsForUser(user.userId);
    // groups.forEach((group) => {
    //   client.join(`group_${group.id}`);
    // });

    this.logger.log(
      `User ${user.userId} connected and joined ${conversations.length} conversations and ${groups.length} groups`,
      // `User ${user.userId} connected and joined ${conversations.length} conversations`,
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
    console.log(data);
    const user = client.data.user as AccessTokenPayload;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    // TODO: fix bug app crash khi không xác thực thành công
    const conversation = await this.conversationRepo.findConversationById(
      data.roomId,
    );

    if (data.roomType === 'conversation') {
      const isAuthorized = await this.conversationRepo.isParticipant(
        user.userId,
        data.roomId,
      );
      if (!isAuthorized || !conversation) {
        client.emit('error', 'Not authorized to send message to this room');
        return;
      }
    } else if (data.roomType === 'group') {
      // TODO: Refactor!!!
      const groupId = conversation?.groupId

      if (!groupId || !conversation){
        client.emit('error', 'Not authorized to send message to this room, group not exist');
        return;
      }

      const group = await this.groupRepo.getGroupById(groupId);
      
      const isAuthorized = await this.groupRepo.isMember(
        user.userId,
        groupId,
      );

      if (!isAuthorized || !group) {
        client.emit('error', 'Not authorized to send message to this room, you are not a member');
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

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    client: Socket,
    data: {
      roomId: string;
      roomType: "group" | "conversation"
    },
  ) {
    // TODO: check group
    const { roomId, roomType } = data;
    const user = client.data.user as AccessTokenPayload;
    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    if (roomType === "conversation") {
      client.join(`conversation_${roomId}`);
    }
    else {
      client.join(`group_${roomId}`);

    }

    this.logger.log(
      // `User ${user.userId} connected and joined ${conversations.length} conversations and ${groups.length} groups`,
      `User ${user.userId} connected and joined Room ${roomId}`,
    );
  }
}
