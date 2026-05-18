import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { UnauthorizedError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';

export const completeProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await userService.completeProfile(req.user.id);

    res.status(200).json({
      message: 'Profile completed successfully',
      user,
      activeSession: req.activeSession,
    });
  },
);

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
