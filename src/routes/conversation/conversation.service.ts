import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConversationRepo } from './conversation.repo';
import { AuthRepository } from '../auth/auth.repo';
import { GroupRepo } from '../group/group.repo';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepo,
    private readonly groupRepo: GroupRepo,
    private readonly authRepository: AuthRepository,
  ) {}

  //
  async createConversation(currentUserId: number, participantId: number) {
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
    ); 

    return conversation;
  }

  async createConversationGroup(currentUserId: number, groupId: number) {
    const group = await this.groupRepo.getGroupById(groupId);
    
    // kiểm tra group có tồn tại không;
    if (!group) {
      throw new UnprocessableEntityException('Group id is invalid');
    }
 
    // kiểm tra phải admin không
    const isAdmin = await this.groupRepo.isAdmin(currentUserId, groupId);
    
    if (!isAdmin) {
      // TODO: refactor lại handle exception
      throw new HttpException('Invalid', HttpStatus.BAD_REQUEST);
    }

    // TODO: refactor
    const participants: number[] = group.members.map((member) => (member.userId)).filter((id) => id !== currentUserId);
    const name: string = group.name;

    const conversation = await this.conversationRepo.createConversationGroup(currentUserId, participants, name, groupId)

    return conversation;
  }

  // Get conversation list
  async getConversations(currentUserId: number) {
    const conversations = await this.conversationRepo.getConversationList(
      currentUserId,
    );

    return conversations;
  }

  // Get conversation 
  async getConversation(conversationId: number) {
    const conversation = await this.conversationRepo.findConversationById(conversationId);

    return conversation;
  }
}
