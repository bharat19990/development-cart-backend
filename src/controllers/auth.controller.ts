import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/async-handler.util';
import { LoginDto } from '../validators/login.validator';
import { RegisterDto } from '../validators/register.validator';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as RegisterDto);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginDto);
  res.status(200).json(result);
});
