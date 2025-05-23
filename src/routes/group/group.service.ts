import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GroupRepo } from './group.repo';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationRepo } from '../conversation/conversation.repo';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepo: GroupRepo,
    private readonly conversationRepo: ConversationRepo,
    private readonly conversationService: ConversationService
  ) { }

  async createGroup(
    name: string,
    description: string | null,
    avatarUrl: string | null,
    members: number[], // user id
    adminId: number,
  ) {
    // mapping
    const _members: {
      userId: number,
      role: "member"
    }[] = members.map((value: number) => ({
      userId: value,
      role: "member"
    }))

    const group = await this.groupRepo.createGroup(name, description, avatarUrl, _members, adminId);
    const conversation = await this.conversationService.createConversationGroup(adminId, group.id);

    return { ...group, conversationId: conversation.id };
  }

  async addMemberToGroup(
    groupId: number,
    userIdToAdd: number,
    currentUserId: number,
  ) {
    const group = await this.groupRepo.getGroupById(groupId);

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const isAdmin = await this.groupRepo.isAdmin(currentUserId, groupId);

    if (!isAdmin) {
      throw new HttpException(
        'Only admin can add members',
        HttpStatus.FORBIDDEN,
      );
    }
    
    const isAlreadyMember = await this.groupRepo.isMember(userIdToAdd, groupId);
    
    if (isAlreadyMember) {
      throw new HttpException(
        'User is already a member',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!group.conversation?.id) {
      throw new HttpException('Cannot add', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.conversationRepo.addParticipant(group.conversation?.id, userIdToAdd);
    return this.groupRepo.addMemberToGroup(groupId, userIdToAdd);
  }

  async removeMemberFromGroup(
    groupId: number,
    userIdToRemove: number,
    currentUserId: number,
  ) {
    const group = await this.groupRepo.getGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const isAdmin = await this.groupRepo.isAdmin(currentUserId, groupId);
    if (!isAdmin) {
      throw new HttpException(
        'Only admin can remove members',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userIdToRemove === group.adminId) {
      throw new HttpException('Cannot remove admin', HttpStatus.BAD_REQUEST);
    }
    
    if (!group.conversation?.id) {
      throw new HttpException('Cannot remove', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.conversationRepo.removeParticipant(group.conversation?.id, userIdToRemove);
    return this.groupRepo.removeMemberFromGroup(groupId, userIdToRemove);
  }

  async getGroupsForUser(userId: number) {
    return this.groupRepo.getGroupsForUser(userId);
  }

  async getGroupById(groupId: number, currentUserId: number) {
    const group = await this.groupRepo.getGroupById(groupId);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    const isMember = await this.groupRepo.isMember(currentUserId, groupId);
    if (!isMember) {
      throw new HttpException(
        'You are not a member of this group',
        HttpStatus.FORBIDDEN,
      );
    }
    return group;
  }
}
