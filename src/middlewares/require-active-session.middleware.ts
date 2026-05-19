import { getActiveSessionOrThrow } from '../services/session-query.service';
import { asyncHandler } from '../utils/async-handler.util';

/** Blocks unless a non-expired ACTIVE admin session exists; sets req.activeSession. */
export const requireActiveSession = asyncHandler(async (req, _res, next) => {
  req.activeSession = await getActiveSessionOrThrow();
  next();
});
