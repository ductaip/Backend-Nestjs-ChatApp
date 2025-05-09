import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GroupRepo } from './group.repo';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepo: GroupRepo) {}

  async createGroup(
    name: string,
    description: string | null,
    avatarUrl: string | null,
    adminId: number,
  ) {
    return this.groupRepo.createGroup(name, description, avatarUrl, adminId);
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
