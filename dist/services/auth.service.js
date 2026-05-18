"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const role_enum_1 = require("../enums/role.enum");
const user_entity_1 = require("../entities/user.entity");
const errors_util_1 = require("../utils/errors.util");
const hash_util_1 = require("../utils/hash.util");
const jwt_util_1 = require("../utils/jwt.util");
const prisma_service_1 = require("./prisma.service");
const userSelect = {
    id: true,
    email: true,
    role: true,
    profileCompleted: true,
    createdAt: true,
    updatedAt: true,
};
class AuthService {
    async register(dto) {
        const existing = await prisma_service_1.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('Email is already registered');
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(dto.password);
        const user = await prisma_service_1.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role ?? role_enum_1.Role.USER,
            },
            select: userSelect,
        });
        const accessToken = this.createToken(user);
        return {
            accessToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    async login(dto) {
        const user = await prisma_service_1.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new errors_util_1.UnauthorizedError('Invalid email or password');
        }
        const passwordValid = await (0, hash_util_1.comparePassword)(dto.password, user.password);
        if (!passwordValid) {
            throw new errors_util_1.UnauthorizedError('Invalid email or password');
        }
        const accessToken = this.createToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            user: new user_entity_1.UserEntity({
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }),
        };
    }
    createToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return (0, jwt_util_1.signToken)(payload);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map