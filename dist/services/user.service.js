"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_entity_1 = require("../entities/user.entity");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("./prisma.service");
const userSelect = {
    id: true,
    email: true,
    role: true,
    profileCompleted: true,
    createdAt: true,
    updatedAt: true,
};
class UserService {
    async completeProfile(userId) {
        const user = await prisma_service_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, profileCompleted: true },
        });
        if (!user) {
            throw new errors_util_1.NotFoundError('User not found');
        }
        if (user.profileCompleted) {
            throw new errors_util_1.BadRequestError('Profile is already completed');
        }
        const updated = await prisma_service_1.prisma.user.update({
            where: { id: userId },
            data: { profileCompleted: true },
            select: userSelect,
        });
        return new user_entity_1.UserEntity(updated);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map