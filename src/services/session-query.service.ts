import { SessionStatus } from '@prisma/client';
import { NotFoundError } from '../utils/errors.util';
import { sessionExpiryService } from './session-expiry.service';
import { prisma } from './prisma.service';

const activeSessionSelect = {
  id: true,
  title: true,
  status: true,
  adminId: true,
  startsAt: true,
  endsAt: true,
} as const;

export type ActiveSessionRecord = {
  id: string;
  title: string;
  status: SessionStatus;
  adminId: string;
  startsAt: Date;
  endsAt: Date;
};

/** Expires overdue sessions, then returns the current ACTIVE session with an assigned admin. */
export async function getActiveSessionOrThrow(): Promise<ActiveSessionRecord> {
  await sessionExpiryService.expireSessions();

  const session = await prisma.session.findFirst({
    where: {
      status: SessionStatus.ACTIVE,
      endsAt: { gte: new Date() },
    },
    select: activeSessionSelect,
    orderBy: { updatedAt: 'desc' },
  });

  if (!session) {
    throw new NotFoundError(
      'No active admin session found. Enrollment and learning features are unavailable.',
    );
  }

  return session;
}

export function isSessionExpired(session: {
  status: SessionStatus;
  endsAt: Date;
}): boolean {
  return (
    session.status === SessionStatus.COMPLETED ||
    session.status === SessionStatus.CANCELLED ||
    session.endsAt < new Date()
  );
}
