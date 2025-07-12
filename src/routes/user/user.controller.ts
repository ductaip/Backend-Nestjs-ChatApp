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
  Param,
  ParseIntPipe,
  Patch,
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
    return await this.userService.getProfile(currentUserId);
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  @ZodSerializerDto(FindUserResDTO)
  async getProfileByEmail(
    @ActiveUser('userId') currentUserId: number,
    @Query() query: GetUser,
  ) {
    // TODO: check if that is current user's email
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

  @Post('upload')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ZodSerializerDto(UploadAvatarResDTO)
  async upload(
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
    Logger.debug('>>>> upload img is running');
    return await this.userService.upload(file);
    return await this.userService.uploadAvatar(currentUserId, file);
  }

  @Get(':id/firebase-token')
  @UseGuards(AccessTokenGuard)
  async getFirebaseToken(@Param('id', ParseIntPipe) userId: number) {
    const token = await this.userService.getFirebaseToken(userId);
    return { firebaseToken: token };
  }

  @Patch(':id/firebase-token')
  @UseGuards(AccessTokenGuard)
  async setFirebaseToken(
    @Param('id', ParseIntPipe) userId: number,
    @Body('token') token: string,
  ) {
    await this.userService.setFirebaseToken(userId, token);
    return { message: 'Firebase token updated successfully' };
  }
}
