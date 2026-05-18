import { EnrollmentEntity } from '../entities/enrollment.entity';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import { EnrollDto } from '../validators/enroll.validator';
export declare class EnrollmentService {
    enroll(user: RequestUser, activeSession: ActiveSessionContext, dto: EnrollDto): Promise<EnrollmentEntity>;
    private resolvePaymentStatus;
    private getUserOrganizationId;
}
export declare const enrollmentService: EnrollmentService;
