import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class AttemptQuizDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  value!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maxValue: number = 100;
}
