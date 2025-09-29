import { PartialType } from "@nestjs/mapped-types";
import { PutUserDto } from "./put-user.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PatchUserDTO extends PartialType(PutUserDto) {
    @ApiPropertyOptional({ example: "abc@def.com", description: "Email người dùng" })
    readonly email?: string;

    @ApiPropertyOptional({ example: "Le Thanh Dat", description: "Họ và tên đầy đủ của người dùng" })
    readonly fullName?: string;

    @ApiPropertyOptional({ example: "12345678",  description: "Mật khẩu của người dùng, tối thiểu 8 ký tự."  })
    readonly password?: string;
}
