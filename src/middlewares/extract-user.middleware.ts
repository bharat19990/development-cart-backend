import { prisma } from '../services/prisma.service';
import { verifyToken } from '../utils/jwt.util';
import { asyncHandler } from '../utils/async-handler.util';

/** Optionally attaches `req.user` when a valid Bearer token is present. */
export const extractUser = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Invalid token: leave req.user unset; authenticateUser rejects protected routes
  }

  next();
});
