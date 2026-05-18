import { SessionStatus } from '../enums/session-status.enum';
export declare class CreateSessionDto {
    title: string;
    description?: string;
    adminId: string;
    organizationId?: string;
    status?: SessionStatus;
    startsAt?: string;
    endsAt?: string;
}
