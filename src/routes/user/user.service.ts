import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {

     constructor(
          private readonly userRepository: UserRepository,
     ) { }

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
               }, currentUserId
          );
          if (!user) throw new UnauthorizedException('User not found');
          return user;
     }

     async getFriendList(currentUserId: number) {

          const friends = await this.userRepository.getFriends({id: currentUserId})

          return friends;
     }
}
