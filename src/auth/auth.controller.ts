import { Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggedInUserDto } from './dto/logged-in-user.dto';
import { MyController } from 'src/common/decorators/my-controller';
import { MyPost } from 'src/common/decorators/routing/my-post.decorator';
import { MyGet } from 'src/common/decorators/routing/my-get.decorator';
import { UserDto } from 'src/users/dto/user.dto';

@MyController({
    prefix: 'auth',
})
export class AuthController {
    constructor(private authService: AuthService) { }

    @MyPost({
        path: 'login',
        summary: 'Đăng nhập và nhận token JWT.',
        response: {
            status: 200,
            description: 'Thành công',
            type: LoggedInUserDto,
        },
        otherResponses: [
            {
                status: 401,
                description: 'Email hoặc mật khẩu không đúng',
            },
        ],
    })
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoggedInUserDto> {
        const user = await this.authService.validateUser(
            loginUserDto.email,
            loginUserDto.password,
        );
        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const accessToken = await this.authService.issueAccessToken(user);
        return {
            accessToken,
            user,
        }
    }

    @MyGet({
        path: 'profile',
        summary: 'Lấy thông tin người dùng đang đăng nhập (tương ứng với JWT token gửi lên).',
        response: {
            status: 200,
            description: 'Thành công',
            type: UserDto,
        },
        otherResponses: [
            {
                status: 401,
                description: 'Chưa xác thực',
            },
        ],
        jwtAuth: true,
    })
    getProfile(@Req() req: Request): UserDto {
        const user = req['user'];
        return user;
    }
}
