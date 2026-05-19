import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { Role } from '../enums/role.enum';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateAdminDto } from '../validators/create-admin.validator';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles(Role.SUPERADMIN),
  validateBody(CreateAdminDto),
  adminController.createAdmin,
);

export default router;
