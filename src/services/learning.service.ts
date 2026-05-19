import { PaymentStatus } from '@prisma/client';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../utils/errors.util';
import { toActivityDate } from '../utils/date.util';
import { AttemptQuizDto } from '../validators/attempt-quiz.validator';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import { prisma } from './prisma.service';

export class LearningService {
  async watchVideo(
    user: RequestUser,
    activeSession: ActiveSessionContext,
    videoId: string,
  ) {
    await this.assertPaidEnrollment(user.id, activeSession.id);

    const video = await prisma.video.findFirst({
      where: { id: videoId, sessionId: activeSession.id },
    });

    if (!video) {
      throw new NotFoundError('Video not found in active session');
    }

    const activityDate = toActivityDate();

    const existing = await prisma.dailyVideoWatch.findUnique({
      where: {
        userId_sessionId_activityDate: {
          userId: user.id,
          sessionId: activeSession.id,
          activityDate,
        },
      },
    });

    if (existing) {
      throw new ConflictError('Daily video limit reached (1 per day)');
    }

    const watch = await prisma.dailyVideoWatch.create({
      data: {
        userId: user.id,
        sessionId: activeSession.id,
        videoId: video.id,
        activityDate,
      },
      include: { video: { select: { id: true, title: true, url: true } } },
    });

    return watch;
  }

  async attemptQuiz(
    user: RequestUser,
    activeSession: ActiveSessionContext,
    quizId: string,
    dto: AttemptQuizDto,
  ) {
    await this.assertPaidEnrollment(user.id, activeSession.id);

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, sessionId: activeSession.id },
    });

    if (!quiz) {
      throw new NotFoundError('Quiz not found in active session');
    }

    if (dto.value < 0 || dto.value > dto.maxValue) {
      throw new BadRequestError('Score value must be between 0 and maxValue');
    }

    const activityDate = toActivityDate();

    const existing = await prisma.dailyQuizAttempt.findUnique({
      where: {
        userId_sessionId_activityDate: {
          userId: user.id,
          sessionId: activeSession.id,
          activityDate,
        },
      },
    });

    if (existing) {
      throw new ConflictError('Daily quiz limit reached (1 per day)');
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const daily = await tx.dailyQuizAttempt.create({
        data: {
          userId: user.id,
          sessionId: activeSession.id,
          quizId: quiz.id,
          activityDate,
          value: dto.value,
          maxValue: dto.maxValue,
        },
        include: { quiz: { select: { id: true, title: true } } },
      });

      await tx.score.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          sessionId: activeSession.id,
          value: dto.value,
          maxValue: dto.maxValue,
        },
      });

      return daily;
    });

    return {
      ...attempt,
      passed: dto.value >= quiz.passingScore,
    };
  }

  async getMyScores(userId: string, sessionId?: string) {
    const scores = await prisma.score.findMany({
      where: {
        userId,
        ...(sessionId ? { sessionId } : {}),
      },
      include: {
        quiz: { select: { id: true, title: true, passingScore: true } },
        session: {
          select: { id: true, title: true, status: true, endsAt: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    return scores;
  }

  async getHistoricalData(userId: string, sessionId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_sessionId: { userId, sessionId },
      },
      include: {
        session: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    const expired = enrollment.session.endsAt < new Date();

    const [scores, videoWatches, quizAttempts] = await Promise.all([
      prisma.score.findMany({
        where: { userId, sessionId },
        include: { quiz: { select: { id: true, title: true } } },
        orderBy: { completedAt: 'desc' },
      }),
      prisma.dailyVideoWatch.findMany({
        where: { userId, sessionId },
        include: { video: { select: { id: true, title: true } } },
        orderBy: { watchedAt: 'desc' },
      }),
      prisma.dailyQuizAttempt.findMany({
        where: { userId, sessionId },
        include: { quiz: { select: { id: true, title: true } } },
        orderBy: { attemptedAt: 'desc' },
      }),
    ]);

    return {
      enrollment,
      session: enrollment.session,
      isExpired: expired,
      canAccessNewContent: !expired && enrollment.session.status === 'ACTIVE',
      scores,
      videoWatches,
      quizAttempts,
    };
  }

  private async assertPaidEnrollment(userId: string, sessionId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });

    if (!enrollment || enrollment.paymentStatus !== PaymentStatus.PAID) {
      throw new ForbiddenError('Paid enrollment required');
    }
  }
}

export const learningService = new LearningService();
