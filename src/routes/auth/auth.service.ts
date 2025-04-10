import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repo';
import {
  LoginBodyType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
} from './auth.model';
import { HashingService } from 'src/shared/services/hashing.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.authRepository.findUniqueUser({
        email: body.email,
      });

      if (user) {
        throw new UnprocessableEntityException([
          {
            message: 'Email is exist',
            path: 'email',
          },
        ]);
      }

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        password: hashedPassword,
      });
    } catch (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Email is exist',
          path: 'email',
        },
      ]);
    }
  }

  async login(body: LoginBodyType) {
    const user = await this.authRepository.findUniqueUser({
      email: body.email,
    });
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'User is not exist',
          path: 'email',
        },
      ]);
    }

    const isPasswordCorrect = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnprocessableEntityException([
        {
          message: 'Password is incorrect',
          path: 'password',
        },
      ]);
    }

    const tokens = await this.generateTokens({
      email: body.email,
      userId: user.id,
      name: user.name,
    });

    return tokens;
  }

  async generateTokens({ email, name, userId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        email,
        name,
        userId,
      }),
      this.tokenService.signRefreshToken({ userId }),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(body: RefreshTokenBodyType) {
    try {
      // 1. Check that refresh token is valid (by decoding)
      const { userId } = await this.tokenService.verifyRefreshToken(
        body.refreshToken,
      );
      if (!userId) {
        throw new UnauthorizedException('Refresh token is incorrect');
      }

      // 2. Check that refresh token is in db
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken(
        {
          token: body.refreshToken,
        },
      );
      if (!refreshTokenInDb)
        throw new UnauthorizedException('Refresh token has been used');

      const tokens = this.generateTokens({
        userId,
        email: refreshTokenInDb.user.email,
        name: refreshTokenInDb.user.name,
      });

      await this.authRepository.deleteRefreshToken({
        token: body.refreshToken,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not exist');
    }
  }

  async logout(body: LogoutBodyType) {
    const { userId } = await this.tokenService.verifyRefreshToken(
      body.refreshToken,
    );
    if (!userId) {
      throw new UnauthorizedException('Refresh token is incorrect');
    }

    //  Check that refresh token is in db
    const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken({
      token: body.refreshToken,
    });
    if (!refreshTokenInDb)
      throw new UnauthorizedException('Refresh token is invalid');
    await this.authRepository.deleteRefreshToken({
      token: body.refreshToken,
    });
    return { message: 'Logout successfully' };
  }
}
