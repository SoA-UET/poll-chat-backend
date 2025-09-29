import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PASSWORD_HASH_ROUNDS } from 'src/common/utils/constants';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<UserDocument | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.hashed_password)) {
            return user;
        }
        return null;
    }

    async issueAccessToken(user: UserDocument): Promise<string> {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload);
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
    }
}
