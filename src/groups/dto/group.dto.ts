import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { ExposeId } from "src/common/decorators/expose-id.decorator";

@Exclude()
export class GroupDto {
    @ApiProperty()
    @ExposeId()
    readonly id?: string;

    @ApiProperty()
    @Expose()
    readonly name: string;
}
