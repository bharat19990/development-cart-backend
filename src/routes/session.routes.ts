import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';
import { Role } from '../enums/role.enum';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateSessionDto } from '../validators/create-session.validator';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles(Role.SUPERADMIN),
  validateBody(CreateSessionDto),
  sessionController.createSession,
);

router.get('/active', authenticateUser, sessionController.getActiveSession);

export default router;
