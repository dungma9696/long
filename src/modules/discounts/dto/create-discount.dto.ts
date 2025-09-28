import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountStatus } from '../../../enums/discount-status.enum';

export class CreateDiscountDto {
  @ApiProperty({ description: 'Discount name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Discount code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Discount percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @ApiProperty({ description: 'Maximum discount amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiProperty({
    description: 'Minimum order amount to apply discount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ description: 'Discount start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Discount end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Usage limit (0 means unlimited)',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;

  @ApiProperty({
    description: 'Discount status',
    enum: DiscountStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;
}
