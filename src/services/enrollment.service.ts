import { PaymentStatus, PaymentType, Prisma } from '@prisma/client';
import { config } from '../config';
import { EnrollmentEntity } from '../entities/enrollment.entity';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.util';
import { EnrollDto } from '../validators/enroll.validator';
import { prisma } from './prisma.service';

const enrollmentSelect = {
  id: true,
  userId: true,
  sessionId: true,
  paymentType: true,
  paymentStatus: true,
  amount: true,
  enrolledAt: true,
  updatedAt: true,
} as const;

export class EnrollmentService {
  async enroll(
    user: RequestUser,
    activeSession: ActiveSessionContext,
    dto: EnrollDto,
  ) {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_sessionId: {
          userId: user.id,
          sessionId: activeSession.id,
        },
      },
      include: { sponsorship: { select: { id: true } } },
    });

    if (existing) {
      throw new ConflictError('You are already enrolled in the active session');
    }

    const fee = new Prisma.Decimal(config.enrollmentFeeUsd);

    if (dto.paymentType === PaymentType.SELF) {
      if (dto.amount !== config.enrollmentFeeUsd) {
        throw new BadRequestError(
          `Enrollment fee must be exactly $${config.enrollmentFeeUsd} USD`,
        );
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          sessionId: activeSession.id,
          paymentType: PaymentType.SELF,
          paymentStatus: PaymentStatus.PAID,
          amount: fee,
        },
        select: enrollmentSelect,
      });

      return new EnrollmentEntity({
        ...enrollment,
        amount: enrollment.amount.toString(),
      });
    }

    const organizationId =
      dto.organizationId ?? (await this.getUserOrganizationId(user.id));

    if (!organizationId) {
      throw new BadRequestError(
        'organizationId is required for SPONSORED enrollment, or use POST /sponsor first',
      );
    }

    const sponsorship = await prisma.sponsorship.findUnique({
      where: {
        organizationId_userId_sessionId: {
          organizationId,
          userId: user.id,
          sessionId: activeSession.id,
        },
      },
    });

    if (!sponsorship) {
      throw new NotFoundError(
        'No sponsorship found. Organization must sponsor you before SPONSORED enrollment.',
      );
    }

    const paymentStatus =
      sponsorship.paymentStatus === PaymentStatus.PAID
        ? PaymentStatus.PAID
        : PaymentStatus.PENDING;

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        sessionId: activeSession.id,
        paymentType: PaymentType.SPONSORED,
        paymentStatus,
        amount: fee,
      },
      select: enrollmentSelect,
    });

    return new EnrollmentEntity({
      ...enrollment,
      amount: enrollment.amount.toString(),
    });
  }

  async getMyEnrollments(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
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
      ...new EnrollmentEntity({
        ...e,
        amount: e.amount.toString(),
      }),
      session: e.session,
      isExpired: e.session.endsAt < new Date(),
    }));
  }

  private async getUserOrganizationId(userId: string): Promise<string | null> {
    const record = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });
    return record?.organizationId ?? null;
  }
}

export const enrollmentService = new EnrollmentService();
