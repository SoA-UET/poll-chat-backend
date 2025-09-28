import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGroupDto {
    @ApiProperty({ example: 'Group A', description: "Tên nhóm" })
    @IsString({
        message: "Tên nhóm không được để trống.",
    })
    readonly name: string;
}
