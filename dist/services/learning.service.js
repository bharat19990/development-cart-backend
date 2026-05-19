"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningService = exports.LearningService = void 0;
const client_1 = require("@prisma/client");
const errors_util_1 = require("../utils/errors.util");
const date_util_1 = require("../utils/date.util");
const prisma_service_1 = require("./prisma.service");
class LearningService {
    async watchVideo(user, activeSession, videoId) {
        await this.assertPaidEnrollment(user.id, activeSession.id);
        const video = await prisma_service_1.prisma.video.findFirst({
            where: { id: videoId, sessionId: activeSession.id },
        });
        if (!video) {
            throw new errors_util_1.NotFoundError('Video not found in active session');
        }
        const activityDate = (0, date_util_1.toActivityDate)();
        const existing = await prisma_service_1.prisma.dailyVideoWatch.findUnique({
            where: {
                userId_sessionId_activityDate: {
                    userId: user.id,
                    sessionId: activeSession.id,
                    activityDate,
                },
            },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('Daily video limit reached (1 per day)');
        }
        const watch = await prisma_service_1.prisma.dailyVideoWatch.create({
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
    async attemptQuiz(user, activeSession, quizId, dto) {
        await this.assertPaidEnrollment(user.id, activeSession.id);
        const quiz = await prisma_service_1.prisma.quiz.findFirst({
            where: { id: quizId, sessionId: activeSession.id },
        });
        if (!quiz) {
            throw new errors_util_1.NotFoundError('Quiz not found in active session');
        }
        if (dto.value < 0 || dto.value > dto.maxValue) {
            throw new errors_util_1.BadRequestError('Score value must be between 0 and maxValue');
        }
        const activityDate = (0, date_util_1.toActivityDate)();
        const existing = await prisma_service_1.prisma.dailyQuizAttempt.findUnique({
            where: {
                userId_sessionId_activityDate: {
                    userId: user.id,
                    sessionId: activeSession.id,
                    activityDate,
                },
            },
        });
        if (existing) {
            throw new errors_util_1.ConflictError('Daily quiz limit reached (1 per day)');
        }
        const attempt = await prisma_service_1.prisma.$transaction(async (tx) => {
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
    async getMyScores(userId, sessionId) {
        const scores = await prisma_service_1.prisma.score.findMany({
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
    async getHistoricalData(userId, sessionId) {
        const enrollment = await prisma_service_1.prisma.enrollment.findUnique({
            where: {
                userId_sessionId: { userId, sessionId },
            },
            include: {
                session: true,
            },
        });
        if (!enrollment) {
            throw new errors_util_1.NotFoundError('Enrollment not found');
        }
        const expired = enrollment.session.endsAt < new Date();
        const [scores, videoWatches, quizAttempts] = await Promise.all([
            prisma_service_1.prisma.score.findMany({
                where: { userId, sessionId },
                include: { quiz: { select: { id: true, title: true } } },
                orderBy: { completedAt: 'desc' },
            }),
            prisma_service_1.prisma.dailyVideoWatch.findMany({
                where: { userId, sessionId },
                include: { video: { select: { id: true, title: true } } },
                orderBy: { watchedAt: 'desc' },
            }),
            prisma_service_1.prisma.dailyQuizAttempt.findMany({
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
    async assertPaidEnrollment(userId, sessionId) {
        const enrollment = await prisma_service_1.prisma.enrollment.findUnique({
            where: { userId_sessionId: { userId, sessionId } },
        });
        if (!enrollment || enrollment.paymentStatus !== client_1.PaymentStatus.PAID) {
            throw new errors_util_1.ForbiddenError('Paid enrollment required');
        }
    }
}
exports.LearningService = LearningService;
exports.learningService = new LearningService();
//# sourceMappingURL=learning.service.js.map