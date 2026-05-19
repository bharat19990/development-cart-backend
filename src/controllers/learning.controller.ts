import { Request, Response } from 'express';
import { learningService } from '../services/learning.service';
import { UnauthorizedError, BadRequestError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';
import { AttemptQuizDto } from '../validators/attempt-quiz.validator';

export const watchVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.activeSession) {
    throw new UnauthorizedError();
  }
  const result = await learningService.watchVideo(
    req.user,
    req.activeSession,
    req.params.videoId as string,
  );
  res.status(201).json({ message: 'Video watched', watch: result });
});

export const attemptQuiz = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.activeSession) {
    throw new UnauthorizedError();
  }
  const result = await learningService.attemptQuiz(
    req.user,
    req.activeSession,
    req.params.quizId as string,
    req.body as AttemptQuizDto,
  );
  res.status(201).json({ message: 'Quiz attempted', attempt: result });
});

export const getMyScores = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  const sessionId = req.query.sessionId as string | undefined;
  const scores = await learningService.getMyScores(req.user.id, sessionId);
  res.json({ scores });
});

export const getSessionHistory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const sessionId = req.params.sessionId as string;
    if (!sessionId) {
      throw new BadRequestError('sessionId is required');
    }
    const data = await learningService.getHistoricalData(
      req.user.id,
      sessionId,
    );
    res.json(data);
  },
);
