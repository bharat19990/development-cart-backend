"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.EnrollmentService = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const enrollment_entity_1 = require("../entities/enrollment.entity");
const errors_util_1 = require("../utils/errors.util");
const prisma_service_1 = require("./prisma.service");
const enrollmentSelect = {
    id: true,
    userId: true,
    sessionId: true,
    paymentType: true,
    paymentStatus: true,
    amount: true,
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
            include: { sponsorship: { select: { id: true } } },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('You are already enrolled in the active session');
        }
        const fee = new client_1.Prisma.Decimal(config_1.config.enrollmentFeeUsd);
        if (dto.paymentType === client_1.PaymentType.SELF) {
            if (dto.amount !== config_1.config.enrollmentFeeUsd) {
                throw new errors_util_1.BadRequestError(`Enrollment fee must be exactly $${config_1.config.enrollmentFeeUsd} USD`);
            }
            const enrollment = await prisma_service_1.prisma.enrollment.create({
                data: {
                    userId: user.id,
                    sessionId: activeSession.id,
                    paymentType: client_1.PaymentType.SELF,
                    paymentStatus: client_1.PaymentStatus.PAID,
                    amount: fee,
                },
                select: enrollmentSelect,
            });
            return new enrollment_entity_1.EnrollmentEntity({
                ...enrollment,
                amount: enrollment.amount.toString(),
            });
        }
        const organizationId = dto.organizationId ?? (await this.getUserOrganizationId(user.id));
        if (!organizationId) {
            throw new errors_util_1.BadRequestError('organizationId is required for SPONSORED enrollment, or use POST /sponsor first');
        }
        const sponsorship = await prisma_service_1.prisma.sponsorship.findUnique({
            where: {
                organizationId_userId_sessionId: {
                    organizationId,
                    userId: user.id,
                    sessionId: activeSession.id,
                },
            },
        });
        if (!sponsorship) {
            throw new errors_util_1.NotFoundError('No sponsorship found. Organization must sponsor you before SPONSORED enrollment.');
        }
        const paymentStatus = sponsorship.paymentStatus === client_1.PaymentStatus.PAID
            ? client_1.PaymentStatus.PAID
            : client_1.PaymentStatus.PENDING;
        const enrollment = await prisma_service_1.prisma.enrollment.create({
            data: {
                userId: user.id,
                sessionId: activeSession.id,
                paymentType: client_1.PaymentType.SPONSORED,
                paymentStatus,
                amount: fee,
            },
            select: enrollmentSelect,
        });
        return new enrollment_entity_1.EnrollmentEntity({
            ...enrollment,
            amount: enrollment.amount.toString(),
        });
    }
    async getMyEnrollments(userId) {
        const enrollments = await prisma_service_1.prisma.enrollment.findMany({
            where: { userId },
            select: {
                ...enrollmentSelect,
                session: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        startsAt: true,
                        endsAt: true,
                        admin: { select: { id: true, email: true } },
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });
        return enrollments.map((e) => ({
            ...new enrollment_entity_1.EnrollmentEntity({
                ...e,
                amount: e.amount.toString(),
            }),
            session: e.session,
            isExpired: e.session.endsAt < new Date(),
        }));
    }
    async getUserOrganizationId(userId) {
        const record = await prisma_service_1.prisma.user.findUnique({
            where: { id: userId },
            select: { organizationId: true },
        });
        return record?.organizationId ?? null;
    }
}
exports.EnrollmentService = EnrollmentService;
exports.enrollmentService = new EnrollmentService();
//# sourceMappingURL=enrollment.service.js.map