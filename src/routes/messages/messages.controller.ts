import { Controller } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('conversations/:id/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
}
