import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { TokenService } from "src/shared/services/token.service";
import { ConversationRepo } from "../conversation/conversation.repo";
import { GroupRepo } from "./group.repo";
import { CreateGroupBodyDTO } from "./group.dto";
import { AccessTokenPayload } from "src/shared/types/jwt.type";
import { GroupService } from "./group.service";

@WebSocketGateway()
export class GroupGateway implements OnGatewayConnection, OnGatewayDisconnect {
     @WebSocketServer() server: Server;
     private logger = new Logger('GroupGateway');

     constructor(
          private readonly tokenService: TokenService,
          private readonly groupService: GroupService,
          private readonly conversationRepo: ConversationRepo,
          private readonly groupRepo: GroupRepo,
     ) { }

     async handleConnection(client: Socket) {
          const token = client.handshake.headers.authorization?.split('Bearer ')[1];
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
     async handleCreateGroup(
          client: Socket,
          data: CreateGroupBodyDTO,
     ) {
          const user = client.data.user as AccessTokenPayload;

          if (!user) {
               client.emit('error', 'Not authenticated');
               return;
          }

          const adminId = user.userId;

          // Handle create new group
          const group = await this.groupService.createGroup(
               data.name,
               data.description,
               data.avatarUrl,
               data.members,
               adminId,
          ).catch(e => {
               client.emit('error', 'Can\'t create group!');
          });

          if (!group) {
               return;
          }

          const roomUsers = group.members.map((member) => (`user_${member.userId}`))
          
          console.log(group, roomUsers);

          this.server.to([...roomUsers])
               .emit('newGroup', { groupId: group.id, conversationId: group.conversationId, groupName: group.name, admin: group.admin.name });
     }
}