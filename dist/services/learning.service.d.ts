import { AttemptQuizDto } from '../validators/attempt-quiz.validator';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
export declare class LearningService {
    watchVideo(user: RequestUser, activeSession: ActiveSessionContext, videoId: string): Promise<{
        video: {
            id: string;
            title: string;
            url: string;
        };
    } & {
        id: string;
        sessionId: string;
        userId: string;
        activityDate: Date;
        watchedAt: Date;
        videoId: string;
    }>;
    attemptQuiz(user: RequestUser, activeSession: ActiveSessionContext, quizId: string, dto: AttemptQuizDto): Promise<{
        passed: boolean;
        quiz: {
            id: string;
            title: string;
        };
        id: string;
        sessionId: string;
        userId: string;
        activityDate: Date;
        value: number;
        maxValue: number;
        attemptedAt: Date;
        quizId: string;
    }>;
    getMyScores(userId: string, sessionId?: string): Promise<({
        session: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.SessionStatus;
            endsAt: Date;
        };
        quiz: {
            id: string;
            title: string;
            passingScore: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        userId: string;
        value: number;
        maxValue: number;
        quizId: string;
        completedAt: Date;
    })[]>;
    getHistoricalData(userId: string, sessionId: string): Promise<{
        enrollment: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string | null;
                title: string;
                description: string | null;
                status: import(".prisma/client").$Enums.SessionStatus;
                adminId: string;
                startsAt: Date;
                endsAt: Date;
            };
        } & {
            id: string;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            enrolledAt: Date;
        };
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string | null;
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.SessionStatus;
            adminId: string;
            startsAt: Date;
            endsAt: Date;
        };
        isExpired: boolean;
        canAccessNewContent: boolean;
        scores: ({
            quiz: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            userId: string;
            value: number;
            maxValue: number;
            quizId: string;
            completedAt: Date;
        })[];
        videoWatches: ({
            video: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            sessionId: string;
            userId: string;
            activityDate: Date;
            watchedAt: Date;
            videoId: string;
        })[];
        quizAttempts: ({
            quiz: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            sessionId: string;
            userId: string;
            activityDate: Date;
            value: number;
            maxValue: number;
            attemptedAt: Date;
            quizId: string;
        })[];
    }>;
    private assertPaidEnrollment;
}
export declare const learningService: LearningService;
