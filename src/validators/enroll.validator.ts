import { IsEnum, IsUUID, ValidateIf } from 'class-validator';
import { PaymentType } from '../enums/payment-type.enum';

export class EnrollDto {
  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @ValidateIf((o: EnrollDto) => o.paymentType === PaymentType.SPONSORED)
  @IsUUID()
  organizationId?: string;
}
