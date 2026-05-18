import { NextFunction, Request, Response } from 'express';
import { Role } from '../enums/role.enum';
import { ForbiddenError } from '../utils/errors.util';

export function authorizeRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Access denied'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(`Required role(s): ${roles.join(', ')}`));
      return;
    }

    next();
  };
}
