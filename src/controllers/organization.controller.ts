import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { asyncHandler } from '../utils/async-handler.util';
import { CreateOrganizationDto } from '../validators/create-organization.validator';

export const createOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await organizationService.create(
      req.body as CreateOrganizationDto,
    );
    res.status(201).json({
      message: 'Organization created',
      ...result,
    });
  },
);
