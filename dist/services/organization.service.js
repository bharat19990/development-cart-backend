"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationService = exports.OrganizationService = void 0;
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
class OrganizationService {
    async create(dto) {
        const existingSlug = await prisma_service_1.prisma.organization.findUnique({
            where: { slug: dto.slug },
        });
        if (existingSlug) {
            throw new errors_util_1.ConflictError('Organization slug already exists');
        }
        if (dto.accountEmail && !dto.accountPassword) {
            throw new errors_util_1.ConflictError('accountPassword is required when accountEmail is provided');
        }
        if (dto.accountEmail) {
            const existingEmail = await prisma_service_1.prisma.user.findUnique({
                where: { email: dto.accountEmail },
            });
            if (existingEmail) {
                throw new errors_util_1.ConflictError('Organization account email already exists');
            }
        }
        return prisma_service_1.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name: dto.name,
                    slug: dto.slug,
                    description: dto.description,
                },
            });
            let account;
            if (dto.accountEmail && dto.accountPassword) {
                const user = await tx.user.create({
                    data: {
                        email: dto.accountEmail,
                        password: await (0, hash_util_1.hashPassword)(dto.accountPassword),
                        role: client_1.Role.ORGANIZATION,
                        organizationId: organization.id,
                    },
                    select: userSelect,
                });
                account = new user_entity_1.UserEntity(user);
            }
            return { organization, account };
        });
    }
}
exports.OrganizationService = OrganizationService;
exports.organizationService = new OrganizationService();
//# sourceMappingURL=organization.service.js.map