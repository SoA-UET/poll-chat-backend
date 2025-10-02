import { GroupsService } from "./groups.service";
import { GroupDto } from "./dto/group.dto";
import { MyController } from "src/common/decorators/my-controller";
import { MyGet } from "src/common/decorators/routing/my-get.decorator";
import { Body, Param, ParseDatePipe, Query, Req } from "@nestjs/common";
import { CreateGroupDto } from "./dto/create-group.dto";
import { MyPost } from "src/common/decorators/routing/my-post.decorator";
import { MyDelete } from "src/common/decorators/routing/my-delete.decorator";
import { UserDto } from "src/users/dto/user.dto";
import { MessageDto } from "src/messages/dto/message.dto";

@MyController({
    prefix: "groups",
})
export class GroupsController {
    constructor(private groupsService: GroupsService) { }

    @MyGet({
        summary: "Tìm các nhóm chat có tên chứa chuỗi truyền vào.",
        response: {
            status: 200,
            description: "Thành công",
            type: GroupDto,
            isArray: true,
        },
        jwtAuth: true,
    })
    async findByNameContains(
        @Query('name') nameContains: string,
        @Query('membershipOnly') membershipOnly: boolean,
        @Req() req: Request,
    ): Promise<GroupDto[]> {
        if (membershipOnly) {
            const userId = req['user'].id as string;
            const groups = await this.groupsService.findByMembership(userId);
            if (!nameContains || nameContains.trim() === '') {
                return groups;
            } else {
                return groups.filter(g => g.name.toLowerCase().includes(nameContains.toLowerCase()));
            }
        } else {
            if (!nameContains || nameContains.trim() === '') {
                return await this.groupsService.findAll();
            } else {
                return await this.groupsService.findByNameContains(nameContains);
            }
        }
    }

    @MyGet({
        path: ':groupId',
        summary: "Lấy thông tin nhóm chat theo ID.",
        response: {
            status: 200,
            description: "Thành công",
            type: GroupDto,
        },
        otherResponses: [
            {
                status: 404,
                description: "Không tìm thấy nhóm",
            }
        ],
        jwtAuth: true,
    })
    async findById(@Param('groupId') id: string): Promise<GroupDto> {
        return await this.groupsService.findById(id);
    }

    @MyPost({
        summary: "Tạo nhóm chat mới.",
        response: {
            status: 201,
            description: "Thành công",
            type: GroupDto,
        },
        jwtAuth: true,
    })
    async create(
        @Body() createGroupDto: CreateGroupDto,
        @Req() req: Request,
    ) {
        const createdBy = req['user'].id;
        return await this.groupsService.create(createdBy, createGroupDto);
    }

    @MyPost({
        path: '/:groupId/members/self',
        summary: "Tham gia nhóm chat.",
        response: {
            status: 201,
            description: "Thành công",
            type: GroupDto,
            isArray: true,
        },
        jwtAuth: true,
    })
    async joinGroup(
        @Param('groupId') groupId: string,
        @Req() req: Request,
    ) {
        const userIds: string[] = [
            req['user'].id as string,
        ];
        await this.groupsService.addUsersToGroup(groupId, userIds);
    }

    @MyDelete({
        path: '/:groupId/members/self',
        summary: "Rời khỏi nhóm chat.",
        response: {
            status: 200,
            description: "Thành công",
        },
        jwtAuth: true,
        mustBeInGroup: true,
    })
    async leaveGroup(
        @Param('groupId') groupId: string,
        @Req() req: Request,
    ) {
        const userIds: string[] = [
            req['user'].id as string,
        ];
        await this.groupsService.removeUsersFromGroup(groupId, userIds);
    }

    @MyGet({
        path: ':groupId/users',
        summary: "Lấy danh sách người dùng trong nhóm chat.",
        response: {
            status: 200,
            description: "Thành công",
            type: UserDto,
            isArray: true,
        },
        jwtAuth: true,
        mustBeInGroup: true,
    })
    async getUsersInGroup(@Param('groupId') groupId: string) {
        return await this.groupsService.getUsersInGroup(groupId);
    }

    @MyGet({
        path: ':groupId/messages',
        summary: "Lấy danh sách tin nhắn trong nhóm chat. HTTP long-polling in effect!",
        response: {
            status: 200,
            description: "Thành công",
            type: MessageDto,
            isArray: true,
        },
        jwtAuth: true,
        mustBeInGroup: true,
    })
    async getMessagesInGroup(
        @Param('groupId') groupId: string,
        @Query('createdAtAfter', new ParseDatePipe()) createdAtAfter: Date,
    ) {
        return this.groupsService.getMessagesInGroupAfter(
            groupId, createdAtAfter,
        );
    }
}
