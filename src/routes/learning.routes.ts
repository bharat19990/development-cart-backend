import { Router } from 'express';
import * as learningController from '../controllers/learning.controller';
import { authenticateUser } from '../middlewares/authenticate-user.middleware';
import { requireActiveSession } from '../middlewares/require-active-session.middleware';
import { requirePaidEnrollment } from '../middlewares/require-paid-enrollment.middleware';
import { requireProfileCompleted } from '../middlewares/require-profile-completed.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { AttemptQuizDto } from '../validators/attempt-quiz.validator';

const router = Router();

const learningChain = [
  authenticateUser,
  requireActiveSession,
  requireProfileCompleted,
  requirePaidEnrollment,
];

router.post(
  '/videos/:videoId/watch',
  ...learningChain,
  learningController.watchVideo,
);

router.post(
  '/quizzes/:quizId/attempt',
  ...learningChain,
  validateBody(AttemptQuizDto),
  learningController.attemptQuiz,
);

router.get('/scores', authenticateUser, learningController.getMyScores);

router.get(
  '/history/:sessionId',
  authenticateUser,
  learningController.getSessionHistory,
);

export default router;
