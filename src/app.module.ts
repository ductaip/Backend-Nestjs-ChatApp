import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { AuthModule } from './routes/auth/auth.module';
import { ConversationModule } from './routes/conversation/conversation.module';
import { MessagesModule } from './routes/messages/messages.module';
import { FriendRequestModule } from './routes/friend/friend-request.module';
import { GroupModule } from './routes/group/group.module';
import { UserController } from './routes/user/user.controller';
import { UserModule } from './routes/user/user.module';
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipe';

@Module({
  imports: [SharedModule, AuthModule, ConversationModule, MessagesModule, FriendRequestModule, GroupModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
