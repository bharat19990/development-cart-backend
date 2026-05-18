import { PaymentStatus } from '@prisma/client';
export declare class SponsorDto {
    userId: string;
    amount: number;
    paymentStatus?: PaymentStatus;
}
