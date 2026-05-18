import { ActiveSessionContext } from './active-session.interface';
import { RequestUser } from './request-user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      activeSession?: ActiveSessionContext;
    }
  }
}

export {};
