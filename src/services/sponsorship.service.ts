import { PaymentStatus, PaymentType, Role } from '@prisma/client';
import { EnrollmentEntity } from '../entities/enrollment.entity';
import { SponsorshipEntity } from '../entities/sponsorship.entity';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../utils/errors.util';
import { SponsorDto } from '../validators/sponsor.validator';
import { prisma } from './prisma.service';

const enrollmentSelect = {
  id: true,
  userId: true,
  sessionId: true,
  paymentType: true,
  paymentStatus: true,
  enrolledAt: true,
  updatedAt: true,
} as const;

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
} as const;

export class SponsorshipService {
  async sponsor(
    organizationUser: RequestUser,
    activeSession: ActiveSessionContext,
    dto: SponsorDto,
  ) {
    const organizationId = await this.resolveOrganizationId(organizationUser);

    const sponsoredUser = await prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, email: true },
    });

    if (!sponsoredUser) {
      throw new NotFoundError('User to sponsor not found');
    }

    const existingSponsorship = await prisma.sponsorship.findUnique({
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
      throw new ConflictError(
        'This organization has already sponsored the user for the active session',
      );
    }

    const paymentStatus = dto.paymentStatus ?? PaymentStatus.PAID;

    const result = await prisma.$transaction(async (tx) => {
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
          throw new ConflictError(
            'Enrollment is already linked to a sponsorship',
          );
        }

        enrollment = await tx.enrollment.update({
          where: { id: enrollment.id },
          data: {
            paymentType: PaymentType.SPONSORED,
            paymentStatus,
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: dto.userId,
            sessionId: activeSession.id,
            paymentType: PaymentType.SPONSORED,
            paymentStatus,
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
      sponsorship: new SponsorshipEntity({
        ...result,
        amount: result.amount.toString(),
        enrollment: result.enrollment
          ? new EnrollmentEntity(result.enrollment)
          : undefined,
      }),
    };
  }

  private async resolveOrganizationId(
    organizationUser: RequestUser,
  ): Promise<string> {
    if (organizationUser.role !== Role.ORGANIZATION) {
      throw new ForbiddenError('Only organization accounts can sponsor users');
    }

    const user = await prisma.user.findUnique({
      where: { id: organizationUser.id },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      throw new BadRequestError(
        'Organization account must be linked to an organization',
      );
    }

    return user.organizationId;
  }
}

export const sponsorshipService = new SponsorshipService();
