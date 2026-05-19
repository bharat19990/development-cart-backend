import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../utils/async-handler.util';
import { CreateAdminDto } from '../validators/create-admin.validator';

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.createAdmin(req.body as CreateAdminDto);
  res.status(201).json({ message: 'Admin created', user: admin });
});
