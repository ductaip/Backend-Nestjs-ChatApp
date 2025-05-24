import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class GroupRepo {
  constructor(private readonly prisma: PrismaService) { }

  async createGroup(
    name: string,
    description: string | null,
    avatarUrl: string | null,
    members: {
      userId: number,
      role: 'member',
    }[],
    adminId: number,
  ) {
    return this.prisma.group.create({
      data: {
        name,
        description,
        avatarUrl,
        admin: {
          connect: { id: adminId },
        },
        members: {
          create: [{
            userId: adminId,
            role: 'admin',
          }, ...members],
        },
      },
      select: {
        id: true,
        admin: true,
        name: true,
        members: {
          include: {
            user: true,
          },
        },
      },
      // include: {
      //   admin: true,
      //   members: {
      //     include: {
      //       user: true,
      //     },
      //   },
      // }
    });
  }

  async addMemberToGroup(
    groupId: number,
    userId: number,
    role: string = 'member',
  ) {
    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role,
      },
      include: {
        group: {
          select: {
            conversation : true,
            admin: true,
            name: true
          }
        }
      }
    });
  }

  async removeMemberFromGroup(groupId: number, userId: number) {
    return this.prisma.groupMember.deleteMany({
      where: {
        groupId,
        userId,
      },
    });
  }

  async getGroupsForUser(userId: number) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        admin: true,
      },
    });
  }

  async getGroupById(groupId: number) {
    return this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        admin: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
        conversation: true
      },
    });
  }

  async isAdmin(userId: number, groupId: number) {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: 'admin',
      },
    });
    return !!member;
  }

  async isMember(userId: number, groupId: number) {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });
    return !!member;
  }
}
