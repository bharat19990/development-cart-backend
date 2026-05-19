import { SessionStatus } from '../enums/session-status.enum';
export interface ActiveSessionContext {
    id: string;
    title: string;
    status: SessionStatus;
    adminId: string;
    startsAt: Date;
    endsAt: Date;
}
