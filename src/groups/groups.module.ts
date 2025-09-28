import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './group.schema';
import { GroupUser, GroupUserSchema } from './group-user.schema';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    providers: [GroupsService],
    controllers: [GroupsController],

    imports: [
        UsersModule,

        MessagesModule,

        MongooseModule.forFeature([
            {
                name: Group.name,
                schema: GroupSchema,
            },

            {
                name: GroupUser.name,
                schema: GroupUserSchema,
            }
        ])
    ],

    exports: [GroupsService],
})
export class GroupsModule {}
