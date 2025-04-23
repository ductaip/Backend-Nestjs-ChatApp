import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupRepo } from './group.repo';

@Module({
  providers: [GroupService, GroupRepo],
  controllers: [GroupController],
})
export class GroupModule {}
