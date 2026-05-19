import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../utils/errors.util';

export function requireProfileCompleted(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user?.profileCompleted) {
    next(
      new ForbiddenError(
        'Complete your profile before accessing learning features',
      ),
    );
    return;
  }

  next();
}
