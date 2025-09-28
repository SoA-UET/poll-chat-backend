import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class AddUsersToGroupDto {
    @ApiProperty({ example: ['68d91540db30f62bef9f22fb', '68d91540db30f62bef9f22fc'], description: "Danh sách ID người dùng" })
    @IsArray({
        message: "Danh sách ID người dùng phải là một mảng (JSON array).",
    })
    @IsString({
        each: true,
        message: "Mỗi ID người dùng không được để trống.",
    })
    readonly userIds: string[];
}
