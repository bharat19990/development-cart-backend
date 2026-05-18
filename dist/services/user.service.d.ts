import { UserEntity } from '../entities/user.entity';
export declare class UserService {
    completeProfile(userId: string): Promise<UserEntity>;
}
export declare const userService: UserService;
