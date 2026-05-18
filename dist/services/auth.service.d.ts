import { UserEntity } from '../entities/user.entity';
import { RegisterDto } from '../validators/register.validator';
import { LoginDto } from '../validators/login.validator';
export declare class AuthService {
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: UserEntity;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: UserEntity;
    }>;
    private createToken;
}
export declare const authService: AuthService;
