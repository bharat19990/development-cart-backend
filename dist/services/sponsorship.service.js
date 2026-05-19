"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sponsorshipService = exports.SponsorshipService = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const enrollment_entity_1 = require("../entities/enrollment.entity");
const sponsorship_entity_1 = require("../entities/sponsorship.entity");
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
const sponsorshipSelect = {
    id: true,
    organizationId: true,
    userId: true,
    sessionId: true,
    enrollmentId: true,
    amount: true,
    paymentStatus: true,
    sponsoredAt: true,
    createdAt: true,
    updatedAt: true,
    enrollment: { select: enrollmentSelect },
};
class SponsorshipService {
    async sponsor(organizationUser, activeSession, dto) {
        const organizationId = await this.resolveOrganizationId(organizationUser);
        const sponsoredUser = await prisma_service_1.prisma.user.findUnique({
            where: { id: dto.userId },
            select: { id: true, email: true },
        });
        if (!sponsoredUser) {
            throw new errors_util_1.NotFoundError('User to sponsor not found');
        }
        const existingSponsorship = await prisma_service_1.prisma.sponsorship.findUnique({
            where: {
                organizationId_userId_sessionId: {
                    organizationId,
                    userId: dto.userId,
                    sessionId: activeSession.id,
                },
            },
            select: { id: true },
        });
        if (existingSponsorship) {
            throw new errors_util_1.ConflictError('This organization has already sponsored the user for the active session');
        }
        const paymentStatus = dto.paymentStatus ?? client_1.PaymentStatus.PAID;
        const fee = new client_1.Prisma.Decimal(config_1.config.enrollmentFeeUsd);
        const result = await prisma_service_1.prisma.$transaction(async (tx) => {
            let enrollment = await tx.enrollment.findUnique({
                where: {
                    userId_sessionId: {
                        userId: dto.userId,
                        sessionId: activeSession.id,
                    },
                },
            });
            if (enrollment) {
                const linkedSponsorship = await tx.sponsorship.findUnique({
                    where: { enrollmentId: enrollment.id },
                    select: { id: true },
                });
                if (linkedSponsorship) {
                    throw new errors_util_1.ConflictError('Enrollment is already linked to a sponsorship');
                }
                if (enrollment.paymentType === client_1.PaymentType.SELF &&
                    enrollment.paymentStatus === client_1.PaymentStatus.PAID) {
                    throw new errors_util_1.ConflictError('User already paid for self-enrollment; sponsorship not allowed');
                }
                enrollment = await tx.enrollment.update({
                    where: { id: enrollment.id },
                    data: {
                        paymentType: client_1.PaymentType.SPONSORED,
                        paymentStatus,
                        amount: fee,
                    },
                });
            }
            else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: dto.userId,
                        sessionId: activeSession.id,
                        paymentType: client_1.PaymentType.SPONSORED,
                        paymentStatus,
                        amount: fee,
                    },
                });
            }
            const sponsorship = await tx.sponsorship.create({
                data: {
                    organizationId,
                    userId: dto.userId,
                    sessionId: activeSession.id,
                    enrollmentId: enrollment.id,
                    amount: dto.amount,
                    paymentStatus,
                },
                select: sponsorshipSelect,
            });
            return sponsorship;
        });
        return {
            sponsorship: new sponsorship_entity_1.SponsorshipEntity({
                ...result,
                amount: result.amount.toString(),
                enrollment: result.enrollment
                    ? new enrollment_entity_1.EnrollmentEntity(result.enrollment)
                    : undefined,
            }),
        };
    }
    async resolveOrganizationId(organizationUser) {
        if (organizationUser.role !== client_1.Role.ORGANIZATION) {
            throw new errors_util_1.ForbiddenError('Only organization accounts can sponsor users');
        }
        const user = await prisma_service_1.prisma.user.findUnique({
            where: { id: organizationUser.id },
            select: { organizationId: true },
        });
        if (!user?.organizationId) {
            throw new errors_util_1.BadRequestError('Organization account must be linked to an organization');
        }
        return user.organizationId;
    }
}
exports.SponsorshipService = SponsorshipService;
exports.sponsorshipService = new SponsorshipService();
//# sourceMappingURL=sponsorship.service.js.map