import { CreateQuizDto } from '../validators/create-quiz.validator';
import { CreateVideoDto } from '../validators/create-video.validator';
import { RequestUser } from '../types/request-user.interface';
export declare class ContentService {
    addVideo(admin: RequestUser, dto: CreateVideoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        url: string;
        durationSec: number | null;
        sortOrder: number;
        sessionId: string;
    }>;
    addQuiz(admin: RequestUser, dto: CreateQuizDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        sessionId: string;
        passingScore: number;
    }>;
    listSessionContent(sessionId: string): Promise<{
        videos: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            url: string;
            durationSec: number | null;
            sortOrder: number;
            sessionId: string;
        }[];
        quizzes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            sessionId: string;
            passingScore: number;
        }[];
    }>;
    private assertAdminOwnsActiveSession;
}
export declare const contentService: ContentService;
