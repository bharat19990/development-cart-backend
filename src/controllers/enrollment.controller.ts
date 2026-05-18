import { Request, Response } from 'express';
import { enrollmentService } from '../services/enrollment.service';
import { BadRequestError, UnauthorizedError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';
import { EnrollDto } from '../validators/enroll.validator';

export const enroll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  if (!req.activeSession) {
    throw new BadRequestError('Active session context is missing');
  }

  const enrollment = await enrollmentService.enroll(
    req.user,
    req.activeSession,
    req.body as EnrollDto,
  );

  res.status(201).json({
    message: 'Enrolled successfully',
    enrollment,
    session: req.activeSession,
  });
});
