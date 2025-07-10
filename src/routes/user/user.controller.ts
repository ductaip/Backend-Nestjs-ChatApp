import {
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodSerializerDto } from 'nestjs-zod';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import {
  FindUserResDTO,
  FriendsListDTO,
  GetUser,
  UserResDTO,
  UploadAvatarResDTO,
} from './user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ZodSerializerDto(UserResDTO)
  async getMe(@ActiveUser('userId') currentUserId: number) {
    Logger.fatal('run on profile users/me');
    console.log('test');
    return await this.userService.getProfile(currentUserId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  // @ZodSerializerDto(FindUserResDTO)
  async getProfileByEmail(
    @ActiveUser('userId') currentUserId: number,
    @Query() query: GetUser,
  ) {
    // TODO: check if that is current user's email
    Logger.debug('>>>> run on get profile');
    const { email } = query;
    return await this.userService.getProfileByEmail(email, currentUserId);
  }

  @Get('/friend-list')
  @UseGuards(AccessTokenGuard)
  @ZodSerializerDto(FriendsListDTO)
  async getFriendList(@ActiveUser('userId') currentUserId: number) {
    Logger.debug('on friend list');
    return await this.userService.getFriendList(currentUserId);
  }

  @Post('upload-avatar')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ZodSerializerDto(UploadAvatarResDTO)
  async uploadAvatar(
    @ActiveUser('userId') currentUserId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    Logger.debug('>>>> run on upload avt');
    return await this.userService.uploadAvatar(currentUserId, file);
  }
}
