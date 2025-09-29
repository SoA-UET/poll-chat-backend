import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { ExposeId } from "src/common/decorators/expose-id.decorator";

@Exclude()
export class MessageDto {
    @ApiProperty()
    @ExposeId()
    readonly id?: string;

    @ApiProperty()
    @Expose()
    readonly content: string;

    @ApiProperty()
    @Expose()
    readonly senderId: string;

    @ApiProperty()
    @Expose()
    readonly groupId: string;

    @ApiProperty()
    @Expose()
    readonly createdAt: Date;
}
