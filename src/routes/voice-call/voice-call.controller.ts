import { Controller, Get, Query } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import envConfig from 'src/shared/config';
@Controller('voice-call')
export class VoiceCallController {
  private appID: string = envConfig.AGORA_APP_ID;
  private appCertificate: string = envConfig.AGORA_APP_CERTIFICATE;

  @Get('token')
  getToken(@Query('channel') channelName: string, @Query('id') uid: string) {
    const role = RtcRole.PUBLISHER;
    const expireTime = 3600; // 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    console.log('channel: ', channelName, '\nid:', uid);

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appID,
      this.appCertificate,
      channelName,
      Number(uid),
      role,
      privilegeExpireTime,
    );

    return { token };
  }
}
