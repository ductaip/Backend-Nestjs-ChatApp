import { Global, Module } from '@nestjs/common';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { PrismaService } from './services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { APIKeyGuard } from './guards/api-key.guard';
import { AccessTokenGuard } from './guards/access-token.guard';

const sharedServices = [
  HashingService,
  TokenService,
  PrismaService,
  APIKeyGuard,
  AccessTokenGuard,
];
@Global()
@Module({
  providers: [...sharedServices],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
