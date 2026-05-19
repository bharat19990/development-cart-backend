"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const user_entity_1 = require("../entities/user.entity");
const errors_util_1 = require("../utils/errors.util");
const hash_util_1 = require("../utils/hash.util");
const prisma_service_1 = require("./prisma.service");
const userSelect = {
    id: true,
    email: true,
    role: true,
    profileCompleted: true,
    createdAt: true,
    updatedAt: true,
};
class AdminService {
    async createAdmin(dto) {
        const existing = await prisma_service_1.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('Email is already registered');
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(dto.password);
        const admin = await prisma_service_1.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: client_1.Role.ADMIN,
            },
            select: userSelect,
        });
        return new user_entity_1.UserEntity(admin);
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=admin.service.js.map