import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repo';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessagesRepository) {}
}
