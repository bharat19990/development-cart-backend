import { Router } from 'express';
import * as contentController from '../controllers/content.controller';
import { Role } from '../enums/role.enum';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { requireActiveSession } from '../middlewares/require-active-session.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateQuizDto } from '../validators/create-quiz.validator';
import { CreateVideoDto } from '../validators/create-video.validator';

const router = Router();

router.post(
  '/videos',
  authenticateUser,
  authorizeRoles(Role.ADMIN),
  requireActiveSession,
  validateBody(CreateVideoDto),
  contentController.addVideo,
);

router.post(
  '/quizzes',
  authenticateUser,
  authorizeRoles(Role.ADMIN),
  requireActiveSession,
  validateBody(CreateQuizDto),
  contentController.addQuiz,
);

router.get(
  '/sessions/:sessionId',
  authenticateUser,
  contentController.listContent,
);

export default router;
