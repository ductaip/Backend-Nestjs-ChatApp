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
import {
  EmailIsExistException,
  PasswordIsIncorrectException,
  RefreshTokenIsIncorrectException,
  RefreshTokenIsUsedException,
  EmailNotFoundException,
} from './auth.error';

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

      if (user) throw EmailIsExistException;

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        password: hashedPassword,
      });
    } catch (error) {
      throw EmailIsExistException;
    }
  }

  async login(body: LoginBodyType) {
    const user = await this.authRepository.findUniqueUser({
      email: body.email,
    });
    if (!user) throw EmailNotFoundException;

    const isPasswordCorrect = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPasswordCorrect) throw PasswordIsIncorrectException;

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
      if (!userId) throw RefreshTokenIsIncorrectException;

      // 2. Check that refresh token is in db
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken(
        {
          token: body.refreshToken,
        },
      );
      if (!refreshTokenInDb) throw RefreshTokenIsUsedException;

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
      throw RefreshTokenIsIncorrectException;
    }
  }

  async logout(body: LogoutBodyType) {
    const { userId } = await this.tokenService.verifyRefreshToken(
      body.refreshToken,
    );
    if (!userId) throw RefreshTokenIsIncorrectException;

    //  Check that refresh token is in db
    const refreshTokenInDb = await this.authRepository.findUniqueRefreshToken({
      token: body.refreshToken,
    });
    if (!refreshTokenInDb) throw RefreshTokenIsUsedException;
    await this.authRepository.deleteRefreshToken({
      token: body.refreshToken,
    });
    return { message: 'Logout successfully' };
  }
}
