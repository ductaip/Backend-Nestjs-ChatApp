import { Controller, Get, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { UserResDTO } from './user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

     constructor(private readonly userService: UserService) {}

     @Get('me')
     @UseGuards(AccessTokenGuard)
     @ZodSerializerDto(UserResDTO)
     async getMe(
          @ActiveUser('userId') currentUserId: number,
     ) {
          return await this.userService.getMe(currentUserId);
     }
}
