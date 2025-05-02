import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import {
  ConversationResDTO,
  CreateConversationBodyDTO,
} from './conversation.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  // @UseGuards(APIKeyGuard)
  // @ZodSerializerDto(ConversationResDTO)
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

  @Get()
  @UseGuards(AccessTokenGuard)
  async getConversations(
    @ActiveUser('userId') currentUserId: number,
  ) {

    const conversations = await this.conversationService.getConversations(currentUserId);

    return conversations;
  }
}
