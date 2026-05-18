import { PaymentStatus, PaymentType } from '@prisma/client';
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
      select: { id: true },
    });

    if (existing) {
      throw new ConflictError('You are already enrolled in the active session');
    }

    const paymentStatus = await this.resolvePaymentStatus(
      user,
      activeSession.id,
      dto,
    );

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        sessionId: activeSession.id,
        paymentType: dto.paymentType,
        paymentStatus,
      },
      select: enrollmentSelect,
    });

    return new EnrollmentEntity(enrollment);
  }

  private async resolvePaymentStatus(
    user: RequestUser,
    sessionId: string,
    dto: EnrollDto,
  ): Promise<PaymentStatus> {
    if (dto.paymentType === PaymentType.SELF) {
      return PaymentStatus.PENDING;
    }

    const organizationId =
      dto.organizationId ?? (await this.getUserOrganizationId(user.id));

    if (!organizationId) {
      throw new BadRequestError(
        'organizationId is required for SPONSORED enrollment',
      );
    }

    const sponsorship = await prisma.sponsorship.findUnique({
      where: {
        organizationId_sessionId: {
          organizationId,
          sessionId,
        },
      },
      select: { paymentStatus: true },
    });

    if (!sponsorship) {
      throw new NotFoundError(
        'No sponsorship found for this organization and active session',
      );
    }

    if (sponsorship.paymentStatus !== PaymentStatus.PAID) {
      return PaymentStatus.PENDING;
    }

    return PaymentStatus.PAID;
  }

  private async getUserOrganizationId(userId: string): Promise<string | null> {
    const record = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true, role: true },
    });

    if (!record?.organizationId) {
      return null;
    }

    return record.organizationId;
  }
}

export const enrollmentService = new EnrollmentService();
