import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";

export class PutUserDto {
    @ApiProperty({ example: "abc@def.com", description: "Email người dùng" })
    @IsEmail({}, { message: "Email không hợp lệ." })
    readonly email: string;

    @ApiProperty({ example: "Le Thanh Dat", description: "Họ và tên đầy đủ của người dùng" })
    @Matches(/^[\p{L}\s]+$/u, { message: "Họ tên chỉ được chứa chữ cái và khoảng trắng"})
    @MinLength(3, { message: "Họ tên phải có ít nhất 3 ký tự"})
    @MaxLength(50, { message: "Họ tên không được vượt quá 50 ký tự"})
    readonly fullName: string;

    @ApiProperty({ example: "12345678",  description: "Mật khẩu của người dùng, tối thiểu 8 ký tự."  })
    @MinLength(8, { message: "Mật khẩu phải có tối thiểu 8 ký tự." })
    readonly password: string;
}
