import { PaymentStatus } from '@prisma/client';
import { ForbiddenError } from '../utils/errors.util';
import { prisma } from '../services/prisma.service';
import { asyncHandler } from '../utils/async-handler.util';

/** Requires PAID enrollment in the current active session. */
export const requirePaidEnrollment = asyncHandler(async (req, _res, next) => {
  if (!req.user || !req.activeSession) {
    next(new ForbiddenError('Access denied'));
    return;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_sessionId: {
        userId: req.user.id,
        sessionId: req.activeSession.id,
      },
    },
    select: { paymentStatus: true },
  });

  if (!enrollment || enrollment.paymentStatus !== PaymentStatus.PAID) {
    next(
      new ForbiddenError(
        'Paid enrollment in the active session is required to access this feature',
      ),
    );
    return;
  }

  next();
});
