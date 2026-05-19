import { Router } from 'express';
import * as organizationController from '../controllers/organization.controller';
import { Role } from '../enums/role.enum';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateOrganizationDto } from '../validators/create-organization.validator';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles(Role.SUPERADMIN),
  validateBody(CreateOrganizationDto),
  organizationController.createOrganization,
);

export default router;
