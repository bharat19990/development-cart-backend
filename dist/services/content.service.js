"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentService = exports.ContentService = void 0;
const client_1 = require("@prisma/client");
const errors_util_1 = require("../utils/errors.util");
const session_query_service_1 = require("./session-query.service");
const prisma_service_1 = require("./prisma.service");
class ContentService {
    async addVideo(admin, dto) {
        const session = await this.assertAdminOwnsActiveSession(admin.id);
        return prisma_service_1.prisma.video.create({
            data: {
                sessionId: session.id,
                title: dto.title,
                description: dto.description,
                url: dto.url,
                durationSec: dto.durationSec,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async addQuiz(admin, dto) {
        const session = await this.assertAdminOwnsActiveSession(admin.id);
        return prisma_service_1.prisma.quiz.create({
            data: {
                sessionId: session.id,
                title: dto.title,
                description: dto.description,
                passingScore: dto.passingScore ?? 70,
            },
        });
    }
    async listSessionContent(sessionId) {
        const [videos, quizzes] = await Promise.all([
            prisma_service_1.prisma.video.findMany({
                where: { sessionId },
                orderBy: { sortOrder: 'asc' },
            }),
            prisma_service_1.prisma.quiz.findMany({ where: { sessionId } }),
        ]);
        return { videos, quizzes };
    }
    async assertAdminOwnsActiveSession(adminId) {
        const session = await (0, session_query_service_1.getActiveSessionOrThrow)();
        if (session.adminId !== adminId) {
            throw new errors_util_1.ForbiddenError('Only the assigned session admin can manage content');
        }
        const admin = await prisma_service_1.prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true },
        });
        if (admin?.role !== client_1.Role.ADMIN) {
            throw new errors_util_1.NotFoundError('Admin not found');
        }
        return session;
    }
}
exports.ContentService = ContentService;
exports.contentService = new ContentService();
//# sourceMappingURL=content.service.js.map