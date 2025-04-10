import { Global, Module } from '@nestjs/common';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { PrismaService } from './services/prisma.service';
import { JwtModule } from '@nestjs/jwt';

const sharedServices = [HashingService, TokenService, PrismaService];
@Global()
@Module({
  providers: [...sharedServices],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
