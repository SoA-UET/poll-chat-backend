import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { ExposeId } from "src/common/decorators/expose-id.decorator";

@Exclude()
export class UserDto {
    @ApiProperty()
    @ExposeId()
    readonly id?: string;

    @ApiProperty()
    @Expose()
    readonly email: string;

    @ApiProperty()
    @Expose()
    readonly fullName: string;
};
