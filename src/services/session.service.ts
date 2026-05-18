import { Prisma, Role, SessionStatus } from '@prisma/client';
import { SessionEntity } from '../entities/session.entity';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.util';
import { CreateSessionDto } from '../validators/create-session.validator';
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
    if (dto.startsAt && dto.endsAt) {
      const start = new Date(dto.startsAt);
      const end = new Date(dto.endsAt);
      if (end <= start) {
        throw new BadRequestError('endsAt must be after startsAt');
      }
    }

    await this.assertAdminAssignable(dto.adminId);

    if (dto.organizationId) {
      await this.assertOrganizationExists(dto.organizationId);
    }

    const status = dto.status ?? SessionStatus.DRAFT;

    const session = await prisma.$transaction(async (tx) => {
      if (status === SessionStatus.ACTIVE) {
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

    return new SessionEntity(session);
  }

  async getActive() {
    const session = await prisma.session.findFirst({
      where: { status: SessionStatus.ACTIVE },
      include: sessionInclude,
      orderBy: { updatedAt: 'desc' },
    });

    if (!session) {
      throw new NotFoundError('No active session found');
    }

    return new SessionEntity(session);
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
      where: { status: SessionStatus.ACTIVE },
      select: { id: true, title: true },
    });

    if (activeSession) {
      throw new ConflictError(
        `Only one ACTIVE session is allowed. Current active session: "${activeSession.title}" (${activeSession.id})`,
      );
    }
  }
}

export const sessionService = new SessionService();
