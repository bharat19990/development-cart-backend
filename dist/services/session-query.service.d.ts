import { SessionStatus } from '@prisma/client';
export type ActiveSessionRecord = {
    id: string;
    title: string;
    status: SessionStatus;
    adminId: string;
    startsAt: Date;
    endsAt: Date;
};
export declare function getActiveSessionOrThrow(): Promise<ActiveSessionRecord>;
export declare function isSessionExpired(session: {
    status: SessionStatus;
    endsAt: Date;
}): boolean;
