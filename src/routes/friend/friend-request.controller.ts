import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import {
  CreateFriendRequestBodyDTO,
  UpdateFriendRequestBodyDTO,
} from './friend-request.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async sendFriendRequest(
    @ActiveUser('userId') requesterId: number,
    @Body() createDto: CreateFriendRequestBodyDTO,
  ) {
    return this.friendRequestService.sendRequest(
      requesterId,
      createDto.recipientEmail,
    );
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async updateFriendRequest(
    @ActiveUser('userId') recipientId: number,
    @Param('id') id: string,
    @Body() updateDto: UpdateFriendRequestBodyDTO,
  ) {
    const requestId = Number(id);
    Logger.debug('run on update friend req');
    if (updateDto.status === 'accepted') {
      Logger.debug('run on accept req');
      return this.friendRequestService.acceptRequest(requestId, recipientId);
    } else if (updateDto.status === 'rejected') {
      Logger.debug('run on reject req');
      return this.friendRequestService.rejectRequest(requestId, recipientId);
    } else {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('pending')
  @UseGuards(AccessTokenGuard)
  async getPendingRequests(@ActiveUser('userId') userId: number) {
    return this.friendRequestService.getPendingRequests(userId);
  }
}
