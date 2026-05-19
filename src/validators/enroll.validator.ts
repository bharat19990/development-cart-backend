import { Type } from 'class-transformer';
import { Equals, IsEnum, IsNumber, IsUUID, ValidateIf } from 'class-validator';
import { ENROLLMENT_FEE_USD } from '../constants/app.constants';
import { PaymentType } from '../enums/payment-type.enum';

export class EnrollDto {
  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @ValidateIf((o: EnrollDto) => o.paymentType === PaymentType.SELF)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Equals(ENROLLMENT_FEE_USD)
  amount?: number;

  @ValidateIf((o: EnrollDto) => o.paymentType === PaymentType.SPONSORED)
  @IsUUID()
  organizationId?: string;
}
