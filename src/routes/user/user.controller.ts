import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { FindUserResDTO, FriendsListDTO, GetUser, UserResDTO } from './user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

     constructor(private readonly userService: UserService) { }

     @Get('me')
     @UseGuards(AccessTokenGuard)
     @ZodSerializerDto(UserResDTO)
     async getMe(
          @ActiveUser('userId') currentUserId: number,
     ) {
          return await this.userService.getProfile(currentUserId);
     }

     @Get('')
     @UseGuards(AccessTokenGuard)
     // @ZodSerializerDto(FindUserResDTO)
     async getProfileByEmail(
          @ActiveUser('userId') currentUserId: number,
          @Query() query: GetUser,
     ) {
          // TODO: check if that is current user's email
          const { email } = query;
          return await this.userService.getProfileByEmail(email, currentUserId);
     }

     @Get("/friend-list")
     @UseGuards(AccessTokenGuard)
     @ZodSerializerDto(FriendsListDTO)
     async getFriendList(
          @ActiveUser('userId') currentUserId: number
     ) {
          return await this.userService.getFriendList(currentUserId);
     }
}
