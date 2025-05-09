import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupBodyDTO, AddMemberBodyDTO } from './group.dto';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async createGroup(@Req() req, @Body() body: CreateGroupBodyDTO) {
    const adminId = req.user.userId;
    return this.groupService.createGroup(
      body.name,
      body.description,
      body.avatarUrl,
      body.members,
      adminId,      
    );
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getGroups(@ActiveUser('userId') userId: number) {
    return this.groupService.getGroupsForUser(userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getGroup(
    @ActiveUser('userId') userId: number,
    @Param('id') id: string,
  ) {
    return this.groupService.getGroupById(Number(id), userId);
  }

  @Post(':id/members')
  async addMember(
    @ActiveUser('userId') currentUserId: number,
    @Param('id') id: string,
    @Body() body: AddMemberBodyDTO,
  ) {
    return this.groupService.addMemberToGroup(
      Number(id),
      body.userId,
      currentUserId,
    );
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @ActiveUser('userId') currentUserId: number,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.groupService.removeMemberFromGroup(
      Number(id),
      Number(userId),
      currentUserId,
    );
  }
}
