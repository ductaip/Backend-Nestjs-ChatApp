import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(currentUserId: number) {
    const user = await this.userRepository.findUniqueUser({
      id: currentUserId,
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async getProfileByEmail(userEmail: string, currentUserId: number) {
    console.log(userEmail);
    const user = await this.userRepository.findFriend(
      {
        email: userEmail,
      },
      currentUserId,
    );
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async getFriendList(currentUserId: number) {
    const friends = await this.userRepository.getFriends({ id: currentUserId });

    return friends;
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    // Get current user to check if avatar exists
    const currentUser = await this.userRepository.findUniqueUser({
      id: userId,
    });
    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    // Upload new avatar to Cloudinary
    const avatarUrl = await this.cloudinaryService.uploadImage(file, 'avatars');

    // Delete old avatar if exists
    if (currentUser.avatarUrl) {
      const oldPublicId = this.cloudinaryService.extractPublicIdFromUrl(
        currentUser.avatarUrl,
      );
      if (oldPublicId) {
        try {
          await this.cloudinaryService.deleteImage(oldPublicId);
        } catch (error) {
          console.error('Failed to delete old avatar:', error);
        }
      }
    }

    // Update user with new avatar URL
    const updatedUser = await this.userRepository.updateUser({
      where: { id: userId },
      data: { avatarUrl },
    });

    return {
      success: true,
      avatarUrl,
      message: 'Avatar uploaded successfully',
    };
  }

  async upload(file: Express.Multer.File) {
    // Get current user to check if avatar exists
    // const currentUser = await this.userRepository.findUniqueUser({ id: userId });

    // Upload new avatar to Cloudinary
    const imageUpload = await this.cloudinaryService.uploadImage(file, 'image');

    return {
      success: true,
      imageUpload,
      message: 'Image is uploaded successfully',
    };
  }
}
