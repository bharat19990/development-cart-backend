import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors.util';

export function authenticateUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    next(new UnauthorizedError('Invalid or missing token'));
    return;
  }

  next();
}
