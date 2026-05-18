import type { RequestUser } from '../../common/interfaces/request-user.interface';
export declare class UsersController {
    getProfile(user: RequestUser): {
        message: string;
        user: RequestUser;
    };
    getAdminResource(user: RequestUser): {
        message: string;
        user: RequestUser;
    };
    getOrganizationResource(user: RequestUser): {
        message: string;
        user: RequestUser;
    };
}
