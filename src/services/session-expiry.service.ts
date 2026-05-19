import { SessionStatus } from '@prisma/client';
import { prisma } from './prisma.service';

export class SessionExpiryService {
  /** Marks ACTIVE sessions past endsAt as COMPLETED. */
  async expireSessions(): Promise<number> {
    const now = new Date();

    const result = await prisma.session.updateMany({
      where: {
        status: SessionStatus.ACTIVE,
        endsAt: { lt: now },
      },
      data: { status: SessionStatus.COMPLETED },
    });

    return result.count;
  }

  startInterval(ms = 60_000): NodeJS.Timeout {
    return setInterval(() => {
      void this.expireSessions();
    }, ms);
  }
}

export const sessionExpiryService = new SessionExpiryService();
