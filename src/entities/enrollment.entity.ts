import { PaymentStatus, PaymentType } from '@prisma/client';

export class EnrollmentEntity {
  id: string;
  userId: string;
  sessionId: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  enrolledAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<EnrollmentEntity>) {
    Object.assign(this, partial);
  }
}
