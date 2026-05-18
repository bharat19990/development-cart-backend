import { PaymentStatus } from '@prisma/client';
import { EnrollmentEntity } from './enrollment.entity';

export class SponsorshipEntity {
  id: string;
  organizationId: string;
  userId: string;
  sessionId: string;
  enrollmentId: string;
  amount: string;
  paymentStatus: PaymentStatus;
  sponsoredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  enrollment?: EnrollmentEntity;

  constructor(partial: Partial<SponsorshipEntity>) {
    Object.assign(this, partial);
  }
}
