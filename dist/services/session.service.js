"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = exports.SessionService = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const session_entity_1 = require("../entities/session.entity");
const errors_util_1 = require("../utils/errors.util");
const date_util_1 = require("../utils/date.util");
const session_query_service_1 = require("./session-query.service");
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
        await this.assertAdminAssignable(dto.adminId);
        if (dto.organizationId) {
            await this.assertOrganizationExists(dto.organizationId);
        }
        const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
        const endsAt = dto.endsAt
            ? new Date(dto.endsAt)
            : (0, date_util_1.addDays)(startsAt, config_1.config.sessionDurationDays);
        if (endsAt <= startsAt) {
            throw new errors_util_1.BadRequestError('endsAt must be after startsAt');
        }
        const status = dto.status ?? client_1.SessionStatus.ACTIVE;
        const session = await prisma_service_1.prisma.$transaction(async (tx) => {
            if (status === client_1.SessionStatus.ACTIVE) {
                await this.assertNoActiveSession(tx);
                await this.assertAdminNotInOpenSession(tx, dto.adminId);
            }
            return tx.session.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    adminId: dto.adminId,
                    organizationId: dto.organizationId,
                    status,
                    startsAt,
                    endsAt,
                },
                include: sessionInclude,
            });
        });
        return new session_entity_1.SessionEntity(session);
    }
    async getActive() {
        const session = await (0, session_query_service_1.getActiveSessionOrThrow)();
        const full = await prisma_service_1.prisma.session.findUnique({
            where: { id: session.id },
            include: sessionInclude,
        });
        return new session_entity_1.SessionEntity(full);
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
            where: {
                status: client_1.SessionStatus.ACTIVE,
                endsAt: { gte: new Date() },
            },
            select: { id: true, title: true },
        });
        if (activeSession) {
            throw new errors_util_1.ConflictError(`Only one ACTIVE session is allowed. Current: "${activeSession.title}"`);
        }
    }
    async assertAdminNotInOpenSession(tx, adminId) {
        const existing = await tx.session.findFirst({
            where: {
                adminId,
                status: client_1.SessionStatus.ACTIVE,
                endsAt: { gte: new Date() },
            },
            select: { id: true, title: true },
        });
        if (existing) {
            throw new errors_util_1.ConflictError(`Admin is already assigned to active session "${existing.title}"`);
        }
    }
}
exports.SessionService = SessionService;
exports.sessionService = new SessionService();
//# sourceMappingURL=session.service.js.map