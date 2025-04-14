import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConversationRepo } from './conversation.repo';
import { AuthRepository } from '../auth/auth.repo';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepo,
    private readonly authRepository: AuthRepository,
  ) {}

  //
  async createConversation(
    currentUserId: number,
    participantId: number,
    name: string,
  ) {
    // Kiểm tra participantId hợp lệ
    if (currentUserId === participantId)
      throw new UnprocessableEntityException('User id is invalid');

    // Kiểm tra người dùng tồn tại
    const participant = await this.authRepository.findUniqueUser({
      id: participantId,
    });
    if (!participant)
      throw new UnprocessableEntityException('Participant is not found');

    const existingConversation =
      await this.conversationRepo.findExistConversation(
        currentUserId,
        participantId,
      );
    if (existingConversation)
      throw new UnprocessableEntityException('Conversation is existed');

    const conversation = await this.conversationRepo.createConversation(
      currentUserId,
      participantId,
      name,
    );
    return conversation;
  }

  //
}
