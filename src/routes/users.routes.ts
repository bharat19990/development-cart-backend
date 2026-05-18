import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { requireActiveSession } from '../middlewares/require-active-session.middleware';
import { Role } from '../enums/role.enum';

const router = Router();

router.post(
  '/complete-profile',
  authenticateUser,
  requireActiveSession,
  usersController.completeProfile,
);

router.get('/me', authenticateUser, usersController.getProfile);

router.get(
  '/admin',
  authenticateUser,
  authorizeRoles(Role.ADMIN, Role.SUPERADMIN),
  usersController.getAdminResource,
);

router.get(
  '/organization',
  authenticateUser,
  authorizeRoles(Role.ORGANIZATION),
  usersController.getOrganizationResource,
);

export default router;
