import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {

     constructor(
          private readonly userRepository: UserRepository,
     ){}

     async getMe(currentUserId: number) {
          const user = await this.userRepository.findUniqueUser({
            id: currentUserId,
          });
          if (!user) throw new UnauthorizedException('User not found');
          return user;
        }
}
