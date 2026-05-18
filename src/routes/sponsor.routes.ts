import { Router } from 'express';
import * as sponsorshipController from '../controllers/sponsorship.controller';
import { Role } from '../enums/role.enum';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { requireActiveSession } from '../middlewares/require-active-session.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { SponsorDto } from '../validators/sponsor.validator';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles(Role.ORGANIZATION),
  requireActiveSession,
  validateBody(SponsorDto),
  sponsorshipController.sponsor,
);

export default router;
