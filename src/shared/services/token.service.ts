import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../config';
import {
  AccessTokenPayload,
  AccessTokenPayloadCreate,
  RefreshTokenPayload,
  RefreshTokenPayloadCreate,
} from '../types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: AccessTokenPayloadCreate) {
    return this.jwtService.sign(
      { ...payload },
      {
        secret: envConfig.ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
      },
    );
  }

  signRefreshToken(payload: RefreshTokenPayloadCreate) {
    return this.jwtService.sign(
      { ...payload },
      {
        secret: envConfig.REFRESH_TOKEN_SECRET,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
      },
    );
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
