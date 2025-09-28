import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { PutGroupDto } from "./put-group.dto";

export class PatchGroupDto extends PartialType(PutGroupDto) {
    @ApiPropertyOptional({ example: "Study Group", description: "Tên nhóm mới" })
    readonly name?: string;
}
