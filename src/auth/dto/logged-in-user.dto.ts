import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UserDto } from "src/users/dto/user.dto";

export class LoggedInUserDto {
    @ApiProperty()
    readonly accessToken: string;

    @ApiProperty({ type: () => UserDto })
    @Type(() => UserDto)
    readonly user: UserDto;
};
