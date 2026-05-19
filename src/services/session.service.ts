import { Prisma, Role, SessionStatus } from '@prisma/client';
import { config } from '../config';
import { SessionEntity } from '../entities/session.entity';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.util';
import { addDays } from '../utils/date.util';
import { CreateSessionDto } from '../validators/create-session.validator';
import { getActiveSessionOrThrow } from './session-query.service';
import { prisma } from './prisma.service';

const sessionInclude = {
  admin: {
    select: { id: true, email: true, role: true },
  },
  organization: {
    select: { id: true, name: true, slug: true },
  },
} as const;

export class SessionService {
  async create(dto: CreateSessionDto) {
    await this.assertAdminAssignable(dto.adminId);

    if (dto.organizationId) {
      await this.assertOrganizationExists(dto.organizationId);
    }

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
    const endsAt = dto.endsAt
      ? new Date(dto.endsAt)
      : addDays(startsAt, config.sessionDurationDays);

    if (endsAt <= startsAt) {
      throw new BadRequestError('endsAt must be after startsAt');
    }

    const status = dto.status ?? SessionStatus.ACTIVE;

    const session = await prisma.$transaction(async (tx) => {
      if (status === SessionStatus.ACTIVE) {
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

    return new SessionEntity(session);
  }

  async getActive() {
    const session = await getActiveSessionOrThrow();
    const full = await prisma.session.findUnique({
      where: { id: session.id },
      include: sessionInclude,
    });
    return new SessionEntity(full!);
  }

  private async assertAdminAssignable(adminId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true },
    });

    if (!admin) {
      throw new NotFoundError('Assigned admin user not found');
    }

    if (admin.role !== Role.ADMIN) {
      throw new BadRequestError('Assigned user must have the ADMIN role');
    }
  }

  private async assertOrganizationExists(organizationId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
  }

  private async assertNoActiveSession(tx: Prisma.TransactionClient) {
    const activeSession = await tx.session.findFirst({
      where: {
        status: SessionStatus.ACTIVE,
        endsAt: { gte: new Date() },
      },
      select: { id: true, title: true },
    });

    if (activeSession) {
      throw new ConflictError(
        `Only one ACTIVE session is allowed. Current: "${activeSession.title}"`,
      );
    }
  }

  private async assertAdminNotInOpenSession(
    tx: Prisma.TransactionClient,
    adminId: string,
  ) {
    const existing = await tx.session.findFirst({
      where: {
        adminId,
        status: SessionStatus.ACTIVE,
        endsAt: { gte: new Date() },
      },
      select: { id: true, title: true },
    });

    if (existing) {
      throw new ConflictError(
        `Admin is already assigned to active session "${existing.title}"`,
      );
    }
  }
}

export const sessionService = new SessionService();
