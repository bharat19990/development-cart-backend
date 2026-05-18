import { SessionStatus } from '../enums/session-status.enum';

export interface ActiveSessionContext {
  id: string;
  title: string;
  status: SessionStatus;
  startsAt: Date | null;
  endsAt: Date | null;
}
