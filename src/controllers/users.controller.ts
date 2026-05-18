import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.util';

export const getProfile = asyncHandler((req: Request, res: Response) => {
  res.json({
    message: 'Authenticated profile',
    user: req.user,
  });
});

export const getAdminResource = asyncHandler((req: Request, res: Response) => {
  res.json({
    message: 'Admin-only resource',
    user: req.user,
  });
});

export const getOrganizationResource = asyncHandler(
  (req: Request, res: Response) => {
    res.json({
      message: 'Organization-only resource',
      user: req.user,
    });
  },
);
