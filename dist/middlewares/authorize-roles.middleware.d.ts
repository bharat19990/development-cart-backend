import { NextFunction, Request, Response } from 'express';
import { Role } from '../enums/role.enum';
export declare function authorizeRoles(...roles: Role[]): (req: Request, _res: Response, next: NextFunction) => void;
