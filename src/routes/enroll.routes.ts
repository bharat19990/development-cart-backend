import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { requireActiveSession } from '../middlewares/require-active-session.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { EnrollDto } from '../validators/enroll.validator';

const router = Router();

router.post(
  '/',
  authenticateUser,
  requireActiveSession,
  validateBody(EnrollDto),
  enrollmentController.enroll,
);

router.get('/history', authenticateUser, enrollmentController.getMyEnrollments);

export default router;
