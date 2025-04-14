import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { CreateConversationBodyDTO } from './conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseGuards(AccessTokenGuard)
  async createConversation(
    @ActiveUser('userId') currentUserId: number,
    @Body() body: CreateConversationBodyDTO,
  ) {
    console.log('controller>>>', currentUserId, body);
    const conversation = await this.conversationService.createConversation(
      currentUserId,
      body.participantId,
    );
    return conversation;
  }
}
