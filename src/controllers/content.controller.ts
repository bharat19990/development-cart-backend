import { Request, Response } from 'express';
import { contentService } from '../services/content.service';
import { UnauthorizedError } from '../utils/errors.util';
import { asyncHandler } from '../utils/async-handler.util';
import { CreateQuizDto } from '../validators/create-quiz.validator';
import { CreateVideoDto } from '../validators/create-video.validator';

export const addVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  const video = await contentService.addVideo(
    req.user,
    req.body as CreateVideoDto,
  );
  res.status(201).json({ message: 'Video added', video });
});

export const addQuiz = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  const quiz = await contentService.addQuiz(
    req.user,
    req.body as CreateQuizDto,
  );
  res.status(201).json({ message: 'Quiz added', quiz });
});

export const listContent = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId as string;
  const content = await contentService.listSessionContent(sessionId);
  res.json(content);
});
