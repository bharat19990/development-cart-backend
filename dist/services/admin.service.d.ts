import { UserEntity } from '../entities/user.entity';
import { CreateAdminDto } from '../validators/create-admin.validator';
export declare class AdminService {
    createAdmin(dto: CreateAdminDto): Promise<UserEntity>;
}
export declare const adminService: AdminService;
