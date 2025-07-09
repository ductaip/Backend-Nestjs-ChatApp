import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

class CreateMessageDto {
  content: string;
}

@Controller()
@UseGuards(AccessTokenGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // async sendMessage(
  //   @ActiveUser('userId') senderId: number,
  //   @Param('id') conversationId: string,
  //   @Body() createMessageDto: CreateMessageDto,
  // ) {
  //   const message = await this.messagesService.sendMessage(
  //     parseInt(conversationId),
  //     {

  //     },
  //     createMessageDto.content,
  //   );
  //   return message;
  // }

  @Get('conversations/:id/messages')
  @UseGuards(AccessTokenGuard)
  async getMessage(
    @ActiveUser('userId') currentUserId: number,
    @Param('id') conversationId: string,
  ) {
    const messages = await this.messagesService.getMessage(
      parseInt(conversationId),
      currentUserId,
    );
    return messages;
  }

  @Get('messages')
  @UseGuards(AccessTokenGuard)
  async getMessages(
    @ActiveUser('userId') currentUserId: number,
    @Query('convoId') convoIds: string[] | string,
  ) {
    const ids = Array.isArray(convoIds) ? convoIds : [convoIds];
    if (ids.length == 0) {
      return [];
    }
    const messages = await this.messagesService.getMessages(
      ids.map((id) => parseInt(id)),
      currentUserId,
    );
    return messages;
  }
}
