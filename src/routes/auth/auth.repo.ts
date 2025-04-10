import { Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RefreshTokenType, RegisterBodyType } from './auth.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Omit<RegisterBodyType, 'confirmPassword'>,
  ): Promise<Omit<UserType, 'password'>> {
    return await this.prismaService.user.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  async findUniqueUser(
    where: { email: string } | { id: number },
  ): Promise<UserType | null> {
    return await this.prismaService.user.findUnique({
      where,
    });
  }

  async createRefreshToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
  }) {
    return await this.prismaService.refreshToken.create({
      data,
    });
  }

  async findUniqueRefreshToken(where: { token: string }) {
    return this.prismaService.refreshToken.findUnique({
      where,
      include: {
        user: true,
      },
    });
  }

  async deleteRefreshToken(where: { token: string }) {
    return this.prismaService.refreshToken.delete({
      where,
    });
  }
}
