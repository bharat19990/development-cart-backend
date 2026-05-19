import { PaymentStatus, PaymentType } from '@prisma/client';
export declare class EnrollmentEntity {
    id: string;
    userId: string;
    sessionId: string;
    paymentType: PaymentType;
    paymentStatus: PaymentStatus;
    amount: string;
    enrolledAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<EnrollmentEntity>);
}
