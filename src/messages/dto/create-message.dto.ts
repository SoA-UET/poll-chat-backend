import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ example: 'Hello, world!', description: "Nội dung tin nhắn" })
    @IsString({
        message: "Nội dung tin nhắn không được để trống.",
    })
    readonly content: string;

    @ApiProperty({ example: '68da513c098f55b358706df0', description: "ID nhóm" })
    @IsString({
        message: "ID nhóm không được để trống.",
    })
    readonly groupId: string;

    @ApiProperty({ example: '68da513c098f55b358706df0', description: "ID người gửi" })
    @IsString({
        message: "ID người gửi không được để trống.",
    })
    readonly senderId: string;
}
