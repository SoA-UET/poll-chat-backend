import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Group, GroupDocument } from "./group.schema";
import { GroupUser, GroupUserDocument } from "./group-user.schema";
import { Model } from "mongoose";
import { escapeRegex } from "src/common/utils/escape-regex.util";
import { CreateGroupDto } from "./dto/create-group.dto";
import { PutGroupDto } from "./dto/put-group.dto";
import { PatchGroupDto } from "./dto/patch-group.dto";
import { UsersService } from "src/users/users.service";
import { UserDocument } from "src/users/user.schema";
import { MessagesService } from "src/messages/messages.service";

@Injectable()
export class GroupsService {
    constructor(
        private usersService: UsersService,
        private messagesService: MessagesService,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(GroupUser.name) private groupUserModel: Model<GroupUserDocument>,
    ) {}

    async findAll(): Promise<GroupDocument[]> {
        return await this.groupModel.find().exec();
    }

    async findByNameContains(nameContains: string): Promise<GroupDocument[]> {
        return await this.groupModel.find({
            name: { $regex: escapeRegex(nameContains), $options: 'i' }
        }).exec();
    }

    async findByMembership(userId: string): Promise<GroupDocument[]> {
        const groupUserRecords = await this.groupUserModel.find({ user_id: userId }).exec();
        const groupIds = groupUserRecords.map(r => r.group_id);
        return await this.groupModel.find({
            $or: [
                { _id: { $in: groupIds } },
                { createdBy: userId },
            ]
        }).exec();
    }

    async findById(id: string): Promise<GroupDocument> {
        const group = await this.groupModel.findById(id).exec();
        if (!group) {
            throw new NotFoundException('Không tìm thấy nhóm với ID này');
        }
        return group;
    }

    async create(createdByUserId: string, createGroupDto: CreateGroupDto) {
        const groupData = {
            ...createGroupDto,
            createdBy: createdByUserId,
        }
        const newGroup = new this.groupModel(groupData);
        return newGroup.save();
    }

    async addUsersToGroup(groupId: string, userIds: string[]): Promise<GroupUserDocument[]> {
        const groupUsers = userIds.map(userId => ({
            group_id: groupId,
            user_id: userId,
        }));

        return this.groupUserModel.insertMany(groupUsers);
    }

    async removeUsersFromGroup(groupId: string, userIds: string[]): Promise<void> {
        await this.groupUserModel.deleteMany({
            group_id: groupId,
            user_id: { $in: userIds } },
        ).exec();
    }

    async getUsersInGroup(groupId: string): Promise<UserDocument[]> {
        const groupUserRecords = await this.groupUserModel.find({ group_id: groupId }).exec();
        const userIds = groupUserRecords.map(r => r.user_id);
        const users = await this.usersService.findByIdIn(userIds);
        return users;
    }

    async isUserInGroup(groupId: string, userId: string): Promise<boolean> {
        const anything = await this.groupUserModel.exists({ group_id: groupId, user_id: userId }).exec();
        return !!anything;
    }

    async put(id: string, putGroupDto: PutGroupDto): Promise<GroupDocument | null> {
        return this.groupModel.findByIdAndUpdate(id, putGroupDto, { new: true }).exec();
    }

    async patch(id: string, patchGroupDto: PatchGroupDto): Promise<GroupDocument | null> {
        const updateData: any = { ...patchGroupDto };
        return this.groupModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async deleteGroupById(id: string) {
        const result = await this.groupModel.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Group not found');
        }

        (
            async () => await this.groupUserModel.deleteMany({ group_id: id }).exec()
        )();

        return { message: "Xóa thành công", id: id };
    }

    async getMessagesInGroupAfter(groupId: string, createdAtAfter?: Date) {
        return await this.messagesService.findByGroupIdAndCreatedAtAfter(groupId, createdAtAfter);
    }

    async sendMessage(groupId: string, senderId: string, content: string) {
        const createMessageDto = {
            groupId,
            senderId,
            content,
        };
        return await this.messagesService.create(createMessageDto);
    }
}
