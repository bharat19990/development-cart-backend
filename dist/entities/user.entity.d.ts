import { Role } from '../enums/role.enum';
export declare class UserEntity {
    id: string;
    email: string;
    role: Role;
    profileCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserEntity>);
}
