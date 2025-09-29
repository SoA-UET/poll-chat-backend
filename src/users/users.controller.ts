import { Body, Param, NotFoundException, Req, ForbiddenException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { DeleteUserDto } from "./dto/delete-user.dto";
import { PutUserDto } from "./dto/put-user.dto";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { PatchUserDTO } from "./dto/patch-user-dto";
import { MyGet } from "src/common/decorators/routing/my-get.decorator";
import { MyPost } from "src/common/decorators/routing/my-post.decorator";
import { MyPut } from "src/common/decorators/routing/my-put.decorator";
import { MyPatch } from "src/common/decorators/routing/my-patch.decorator";
import { MyDelete } from "src/common/decorators/routing/my-delete.decorator";
import { MyController } from "src/common/decorators/my-controller";

@MyController({
    prefix: 'users',
})
export class UsersController {
    constructor(private usersService: UsersService) {}

    @MyGet({
        summary: "Lấy danh sách tất cả người dùng trong hệ thống.",
        response: {
            status: 200,
            description: "Thành công",
            type: UserDto,
            isArray: true,
        },
    })
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }


    @MyGet({
        path: ':id',
        summary: "Lấy thông tin người dùng theo ID.",
        response: {
            status: 200,
            description: "Thành công",
            type: UserDto,
        },
        otherResponses: [
            {
                status: 404,
                description: "Không tìm thấy người dùng",
            }
        ],
    })
    async findById(@Param('id') id: string): Promise<UserDto> {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng với ID này');
        }
        return user;
    }

    @MyPost({
        summary: "Đăng ký tài khoản người dùng mới.",
        response: {
            status: 201,
            description: "Thành công",
            type: UserDto,
        },
    })
    async create(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.usersService.create(createUserDto);
        return newUser;
    }

    @MyPut({
        path: ':id',
        summary: "Cập nhật toàn bộ thông tin người dùng.",
        response: {
            status: 200,
            description: "Cập nhật thành công",
            type: UserDto,
        },
        otherResponses: [
            {
                status: 404,
                description: "Không tìm thấy người dùng",
            },

            {
                status: 403,
                description: "Bạn không có quyền cập nhật người dùng này (khi id trong JWT token không khớp với id trong param)",
            }
        ],
        jwtAuth: true,
    })
    put(@Param('id', ParseObjectIdPipe) id: string, @Body() putUserDto: PutUserDto, @Req() req: Request) {
        if (req['user'] && req['user'].id != id) {
            throw new ForbiddenException('Bạn không có quyền cập nhật người dùng này');
        }
        return this.usersService.put(id, putUserDto);
    }

    @MyPatch({
        path: ':id',
        summary: "Cập nhật một phần thông tin người dùng.",
        response: {
            status: 200,
            description: "Cập nhật thành công",
            type: UserDto,
        },
        otherResponses: [
            {
                status: 404,
                description: "Không tìm thấy người dùng",
            },
            {
                status: 403,
                description: "Bạn không có quyền cập nhật người dùng này (khi id trong JWT token không khớp với id trong param)",
            },
        ],
        jwtAuth: true,
    })
    patch(@Param('id', ParseObjectIdPipe) id: string, @Body() patchUserDto: PatchUserDTO, @Req() req: Request) {
        if (req['user'] && req['user'].id != id) {
            throw new ForbiddenException('Bạn không có quyền cập nhật người dùng này');
        }
        return this.usersService.patch(id, patchUserDto);
    }

    @MyDelete({
        path: ':id',
        summary: "Xóa user theo id.",
        response: {
            status: 200,
            description: "Xóa thành công",
        },
        otherResponses: [
            {
                status: 404,
                description: "Không tìm thấy người dùng",
            }
        ],
        jwtAuth: true,
    })
    async deleteUser(@Param("id") id: string) {
        const dto = new DeleteUserDto(id);
        return this.usersService.deleteUserById(dto);
    }
}
