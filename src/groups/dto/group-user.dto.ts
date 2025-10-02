import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GroupUserDto {
    @ApiProperty()
    @Expose()
    readonly group_id: string;

    @ApiProperty()
    @Expose()
    readonly user_id: string;
}
