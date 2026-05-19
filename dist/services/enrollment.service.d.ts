import { PaymentStatus, PaymentType } from '@prisma/client';
import { EnrollmentEntity } from '../entities/enrollment.entity';
import { ActiveSessionContext } from '../types/active-session.interface';
import { RequestUser } from '../types/request-user.interface';
import { EnrollDto } from '../validators/enroll.validator';
export declare class EnrollmentService {
    enroll(user: RequestUser, activeSession: ActiveSessionContext, dto: EnrollDto): Promise<EnrollmentEntity>;
    getMyEnrollments(userId: string): Promise<{
        session: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.SessionStatus;
            startsAt: Date;
            endsAt: Date;
            admin: {
                id: string;
                email: string;
            };
        };
        isExpired: boolean;
        id: string;
        userId: string;
        sessionId: string;
        paymentType: PaymentType;
        paymentStatus: PaymentStatus;
        amount: string;
        enrolledAt: Date;
        updatedAt: Date;
    }[]>;
    private getUserOrganizationId;
}
export declare const enrollmentService: EnrollmentService;
