"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.EnrollmentService = void 0;
const client_1 = require("@prisma/client");
const enrollment_entity_1 = require("../entities/enrollment.entity");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("./prisma.service");
const enrollmentSelect = {
    id: true,
    userId: true,
    sessionId: true,
    paymentType: true,
    paymentStatus: true,
    enrolledAt: true,
    updatedAt: true,
};
class EnrollmentService {
    async enroll(user, activeSession, dto) {
        const existing = await prisma_service_1.prisma.enrollment.findUnique({
            where: {
                userId_sessionId: {
                    userId: user.id,
                    sessionId: activeSession.id,
                },
            },
            select: { id: true },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('You are already enrolled in the active session');
        }
        const paymentStatus = await this.resolvePaymentStatus(user, activeSession.id, dto);
        const enrollment = await prisma_service_1.prisma.enrollment.create({
            data: {
                userId: user.id,
                sessionId: activeSession.id,
                paymentType: dto.paymentType,
                paymentStatus,
            },
            select: enrollmentSelect,
        });
        return new enrollment_entity_1.EnrollmentEntity(enrollment);
    }
    async resolvePaymentStatus(user, sessionId, dto) {
        if (dto.paymentType === client_1.PaymentType.SELF) {
            return client_1.PaymentStatus.PENDING;
        }
        const organizationId = dto.organizationId ?? (await this.getUserOrganizationId(user.id));
        if (!organizationId) {
            throw new errors_util_1.BadRequestError('organizationId is required for SPONSORED enrollment');
        }
        const sponsorship = await prisma_service_1.prisma.sponsorship.findUnique({
            where: {
                organizationId_userId_sessionId: {
                    organizationId,
                    userId: user.id,
                    sessionId,
                },
            },
            select: { paymentStatus: true },
        });
        if (!sponsorship) {
            throw new errors_util_1.NotFoundError('No sponsorship found for this user, organization, and active session');
        }
        if (sponsorship.paymentStatus !== client_1.PaymentStatus.PAID) {
            return client_1.PaymentStatus.PENDING;
        }
        return client_1.PaymentStatus.PAID;
    }
    async getUserOrganizationId(userId) {
        const record = await prisma_service_1.prisma.user.findUnique({
            where: { id: userId },
            select: { organizationId: true, role: true },
        });
        if (!record?.organizationId) {
            return null;
        }
        return record.organizationId;
    }
}
exports.EnrollmentService = EnrollmentService;
exports.enrollmentService = new EnrollmentService();
//# sourceMappingURL=enrollment.service.js.map