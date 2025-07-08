import { HttpException, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from 'src/shared/services/token.service';
import { ConversationRepo } from '../conversation/conversation.repo';
import { GroupRepo } from './group.repo';
import { AddMemberBodyDTO, CreateGroupBodyDTO } from './group.dto';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';
import { GroupService } from './group.service';

@WebSocketGateway()
export class GroupGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('GroupGateway');

  constructor(
    private readonly tokenService: TokenService,
    private readonly groupService: GroupService,
    private readonly conversationRepo: ConversationRepo,
    private readonly groupRepo: GroupRepo,
  ) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake.headers.authorization?.split('Bearer ')[1] ??
      client.handshake.query.token;
    const user = await this.tokenService.verifyAccessToken(token as string);
    if (!user) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User ${client.data.user?.userId} disconnected`);
  }

  @SubscribeMessage('createGroup')
  async handleCreateGroup(client: Socket, data: CreateGroupBodyDTO) {
    const user = client.data.user as AccessTokenPayload;

    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const adminId = user.userId;

    // Handle create new group
    const group = await this.groupService
      .createGroup(
        data.name,
        data.description,
        data.avatarUrl,
        data.members,
        adminId,
      )
      .catch((e) => {
        client.emit('error', "Can't create group!");
      });

    if (!group) {
      return;
    }

    const roomUsers = group.members.map((member) => `user_${member.userId}`);

    console.log(group, roomUsers);

    this.server.to([...roomUsers]).emit('newGroup', {
      groupId: group.id,
      conversationId: group.conversationId,
      groupName: group.name,
      admin: group.admin.name,
    });
  }

  @SubscribeMessage('addMember')
  async handleAddMemberToGroup(
    client: Socket,
    data: {
      groupId: number;
      memberId: number;
    },
  ) {
    const user = client.data.user as AccessTokenPayload;

    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const { groupId, memberId } = data;

    try {
      const { group } = await this.groupService.addMemberToGroup(
        Number(groupId),
        memberId,
        user.userId,
      );

      this.server.to([`user_${memberId}`]).emit('newGroup', {
        groupId: groupId,
        conversationId: group.conversation?.id,
        groupName: group.name,
        admin: group.admin.name,
      });
    } catch (error) {
      let response: string = '';

      if (error instanceof HttpException) {
        response =
          typeof error.getResponse() === 'string'
            ? (error.getResponse() as string)
            : '';
      }

      client.emit('error', `Cannot add member to group, ${response}`);
      return;
    }
  }

  @SubscribeMessage('deleteMember')
  async handleDeleteMemberFromGroup(
    client: Socket,
    data: {
      groupId: number;
      memberId: number;
    },
  ) {
    const user = client.data.user as AccessTokenPayload;

    if (!user) {
      client.emit('error', 'Not authenticated');
      return;
    }

    const { groupId, memberId: userId } = data;
    const currentUserId = user.userId;
    const isAdmin = await this.groupRepo.isAdmin(user.userId, groupId);
    const isMember = await this.groupRepo.isMember(user.userId, groupId);

    if (!isAdmin || !isMember) {
      client.emit(
        'error',
        "Not authenticated, you'r not Member of this group!",
      );
      return;
    }

    try {
      const payload = await this.groupService.removeMemberFromGroup(
        Number(groupId),
        Number(userId),
        currentUserId,
      );

      this.server
        .to([`user_${userId}`])
        .emit('leaveGroup', { groupId: groupId });
    } catch (error) {
      let response: string = '';

      if (error instanceof HttpException) {
        response =
          typeof error.getResponse() === 'string'
            ? (error.getResponse() as string)
            : '';
      }

      client.emit('error', `Cannot delete member from group, ${response}`);
      return;
    }
  }
}
