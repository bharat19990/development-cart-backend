import { Request, Response } from 'express';
import { healthService } from '../services/health.service';
import { asyncHandler } from '../utils/async-handler.util';

export const getRoot = asyncHandler((_req: Request, res: Response) => {
  res.json(healthService.getStatus());
});

export const getHealth = asyncHandler((_req: Request, res: Response) => {
  res.json(healthService.getStatus());
});
