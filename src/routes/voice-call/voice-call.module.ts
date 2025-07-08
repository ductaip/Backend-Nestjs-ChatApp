import { Module } from '@nestjs/common';
import { VoiceCallController } from './voice-call.controller';

@Module({
  controllers: [VoiceCallController]
})
export class VoiceCallModule {}
