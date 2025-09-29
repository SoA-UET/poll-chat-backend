import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'abc@def.com', description: "Email người dùng" })
    @IsString({
        message: "Email không được để trống.",
    })
    @IsEmail(undefined, {
        message: "Email không hợp lệ.",
    })
    readonly email: string;

    @ApiProperty({ example: '12345678', description: "Mật khẩu của người dùng, tối thiểu 8 ký tự." })
    @IsString({
        message: "Mật khẩu không được để trống.",
    })
    @MinLength(8, {
        message: "Mật khẩu phải có tối thiểu 8 ký tự.",
    })
    readonly password: string;
}
