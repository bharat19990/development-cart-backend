import { Role } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../utils/errors.util';
import { CreateQuizDto } from '../validators/create-quiz.validator';
import { CreateVideoDto } from '../validators/create-video.validator';
import { RequestUser } from '../types/request-user.interface';
import { getActiveSessionOrThrow } from './session-query.service';
import { prisma } from './prisma.service';

export class ContentService {
  async addVideo(admin: RequestUser, dto: CreateVideoDto) {
    const session = await this.assertAdminOwnsActiveSession(admin.id);

    return prisma.video.create({
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

  async addQuiz(admin: RequestUser, dto: CreateQuizDto) {
    const session = await this.assertAdminOwnsActiveSession(admin.id);

    return prisma.quiz.create({
      data: {
        sessionId: session.id,
        title: dto.title,
        description: dto.description,
        passingScore: dto.passingScore ?? 70,
      },
    });
  }

  async listSessionContent(sessionId: string) {
    const [videos, quizzes] = await Promise.all([
      prisma.video.findMany({
        where: { sessionId },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.quiz.findMany({ where: { sessionId } }),
    ]);
    return { videos, quizzes };
  }

  private async assertAdminOwnsActiveSession(adminId: string) {
    const session = await getActiveSessionOrThrow();

    if (session.adminId !== adminId) {
      throw new ForbiddenError(
        'Only the assigned session admin can manage content',
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (admin?.role !== Role.ADMIN) {
      throw new NotFoundError('Admin not found');
    }

    return session;
  }
}

export const contentService = new ContentService();
