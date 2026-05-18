import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { asyncHandler } from '../utils/async-handler.util';
import { CreateSessionDto } from '../validators/create-session.validator';

export const createSession = asyncHandler(
  async (req: Request, res: Response) => {
    const session = await sessionService.create(req.body as CreateSessionDto);
    res.status(201).json(session);
  },
);

export const getActiveSession = asyncHandler(
  async (_req: Request, res: Response) => {
    const session = await sessionService.getActive();
    res.json(session);
  },
);
