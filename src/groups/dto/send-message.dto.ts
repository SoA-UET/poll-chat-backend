import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendMessageDto {
    @ApiProperty({ example: 'Hello, world!', description: "Nội dung tin nhắn" })
    @IsString({
        message: "Nội dung tin nhắn không được để trống.",
    })
    readonly content: string;
}
