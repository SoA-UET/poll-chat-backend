import { DeleteUserDto } from "./dto/delete-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model, isValidObjectId } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { PutUserDto } from "./dto/put-user.dto";
import * as bcrypt from 'bcrypt';
import { UserDto } from "./dto/user.dto";
import { PatchUserDTO } from "./dto/patch-user-dto";
import { PASSWORD_HASH_ROUNDS } from "src/common/utils/constants";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findAll(): Promise<UserDto[]> {
        return await this.userModel.find().exec();
    }

    async findById(id: string): Promise<UserDto | null> {
        // Validate ObjectId format using mongoose's built-in validator
        if (!isValidObjectId(id)) {
            return null;
        }
        return await this.userModel.findById(id).exec();
    }

    async findByIdIn(ids: string[]): Promise<UserDocument[]> {
        return await this.userModel.find({ _id: { $in: ids } }).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, PASSWORD_HASH_ROUNDS);
        const newUser = new this.userModel({
            ...createUserDto,
            hashed_password: hashedPassword,
        });
        return newUser.save();
    }

    async put(id: string, putUserDto: PutUserDto): Promise<UserDto | null> {
        const updateData: any = { ...putUserDto };

        if (putUserDto.password) {
            updateData.hashed_password = await bcrypt.hash(putUserDto.password, PASSWORD_HASH_ROUNDS);
            delete updateData.password;
        }

        const updatedRecord = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedRecord) {
            throw new NotFoundException("Không tìm thấy user với id đã cho");
        }
        return updatedRecord;
    }

    async patch(id: string, patchUserDto: PatchUserDTO): Promise<UserDto | null> {
        const updateData: any = { ...patchUserDto };

        if (patchUserDto.password) {
            updateData.hashed_password = await bcrypt.hash(patchUserDto.password, PASSWORD_HASH_ROUNDS);
            delete updateData.password;
        }

        const updatedRecord = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedRecord) {
            throw new NotFoundException("Không tìm thấy user với id đã cho");
        }
        return updatedRecord;
    }

    async deleteUserById(deleteUserDto: DeleteUserDto) {
        const result = await this.userModel.findByIdAndDelete(deleteUserDto.id);
        if (!result) {
            throw new NotFoundException("Không tìm thấy user với id đã cho");
        }
        return { message: "Xóa thành công", id: deleteUserDto.id };
    }
}
