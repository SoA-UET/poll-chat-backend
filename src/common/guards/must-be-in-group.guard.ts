import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class MustBeInGroupGuard implements CanActivate {
    constructor(
        private readonly groupsService: GroupsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const user = request.user; // populated by JwtAuth guard
        const groupId = request.params.groupId; // assuming :groupId route param

        if (!user) {
            throw new ForbiddenException('Bạn chưa đăng nhập.');
        }

        const userId = user.id;
        const userInGroup: boolean = await
            this.groupsService.isUserInGroup(groupId, userId);

        if (!userInGroup) {
            throw new ForbiddenException(`Bạn không ở trong nhóm này.`);
        }

        return true;
    }
}
