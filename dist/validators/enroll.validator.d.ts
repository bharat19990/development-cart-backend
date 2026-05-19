import { PaymentType } from '../enums/payment-type.enum';
export declare class EnrollDto {
    paymentType: PaymentType;
    amount?: number;
    organizationId?: string;
}
