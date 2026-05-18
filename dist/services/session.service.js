"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = exports.SessionService = void 0;
const client_1 = require("@prisma/client");
const session_entity_1 = require("../entities/session.entity");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("./prisma.service");
const sessionInclude = {
    admin: {
        select: { id: true, email: true, role: true },
    },
    organization: {
        select: { id: true, name: true, slug: true },
    },
};
class SessionService {
    async create(dto) {
        if (dto.startsAt && dto.endsAt) {
            const start = new Date(dto.startsAt);
            const end = new Date(dto.endsAt);
            if (end <= start) {
                throw new errors_util_1.BadRequestError('endsAt must be after startsAt');
            }
        }
        await this.assertAdminAssignable(dto.adminId);
        if (dto.organizationId) {
            await this.assertOrganizationExists(dto.organizationId);
        }
        const status = dto.status ?? client_1.SessionStatus.DRAFT;
        const session = await prisma_service_1.prisma.$transaction(async (tx) => {
            if (status === client_1.SessionStatus.ACTIVE) {
                await this.assertNoActiveSession(tx);
            }
            return tx.session.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    adminId: dto.adminId,
                    organizationId: dto.organizationId,
                    status,
                    startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
                    endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
                },
                include: sessionInclude,
            });
        });
        return new session_entity_1.SessionEntity(session);
    }
    async getActive() {
        const session = await prisma_service_1.prisma.session.findFirst({
            where: { status: client_1.SessionStatus.ACTIVE },
            include: sessionInclude,
            orderBy: { updatedAt: 'desc' },
        });
        if (!session) {
            throw new errors_util_1.NotFoundError('No active session found');
        }
        return new session_entity_1.SessionEntity(session);
    }
    async assertAdminAssignable(adminId) {
        const admin = await prisma_service_1.prisma.user.findUnique({
            where: { id: adminId },
            select: { id: true, role: true },
        });
        if (!admin) {
            throw new errors_util_1.NotFoundError('Assigned admin user not found');
        }
        if (admin.role !== client_1.Role.ADMIN) {
            throw new errors_util_1.BadRequestError('Assigned user must have the ADMIN role');
        }
    }
    async assertOrganizationExists(organizationId) {
        const organization = await prisma_service_1.prisma.organization.findUnique({
            where: { id: organizationId },
            select: { id: true },
        });
        if (!organization) {
            throw new errors_util_1.NotFoundError('Organization not found');
        }
    }
    async assertNoActiveSession(tx) {
        const activeSession = await tx.session.findFirst({
            where: { status: client_1.SessionStatus.ACTIVE },
            select: { id: true, title: true },
        });
        if (activeSession) {
            throw new errors_util_1.ConflictError(`Only one ACTIVE session is allowed. Current active session: "${activeSession.title}" (${activeSession.id})`);
        }
    }
}
exports.SessionService = SessionService;
exports.sessionService = new SessionService();
//# sourceMappingURL=session.service.js.map