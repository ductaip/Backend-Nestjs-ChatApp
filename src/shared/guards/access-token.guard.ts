import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    if (!accessToken) return false;

    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      request['user'] = decodedAccessToken;
      return true;
    } catch {
      return false;
    }
  }
}
