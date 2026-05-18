import { SessionStatus } from '@prisma/client';
import { NotFoundError } from '../utils/errors.util';
import { prisma } from '../services/prisma.service';
import { asyncHandler } from '../utils/async-handler.util';

/** Blocks the request unless exactly one ACTIVE session exists in the system. */
export const requireActiveSession = asyncHandler(async (req, _res, next) => {
  const activeSession = await prisma.session.findFirst({
    where: { status: SessionStatus.ACTIVE },
    select: {
      id: true,
      title: true,
      status: true,
      startsAt: true,
      endsAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (!activeSession) {
    throw new NotFoundError('No active session found');
  }

  req.activeSession = activeSession;
  next();
});
