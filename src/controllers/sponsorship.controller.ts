import { Request, Response } from 'express';
import { sponsorshipService } from '../services/sponsorship.service';
import { BadRequestError, UnauthorizedError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';
import { SponsorDto } from '../validators/sponsor.validator';

export const sponsor = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  if (!req.activeSession) {
    throw new BadRequestError('Active session context is missing');
  }

  const result = await sponsorshipService.sponsor(
    req.user,
    req.activeSession,
    req.body as SponsorDto,
  );

  res.status(201).json({
    message: 'User sponsored successfully',
    ...result,
    session: req.activeSession,
  });
});
