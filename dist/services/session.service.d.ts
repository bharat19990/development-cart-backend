import { SessionEntity } from '../entities/session.entity';
import { CreateSessionDto } from '../validators/create-session.validator';
export declare class SessionService {
    create(dto: CreateSessionDto): Promise<SessionEntity>;
    getActive(): Promise<SessionEntity>;
    private assertAdminAssignable;
    private assertOrganizationExists;
    private assertNoActiveSession;
    private assertAdminNotInOpenSession;
}
export declare const sessionService: SessionService;
