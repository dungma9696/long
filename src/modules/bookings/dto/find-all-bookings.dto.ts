import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BookingStatus } from '../../../enums/booking-status.enum';

export class FindAllBookingsDto {
  @ApiProperty({
    description: 'Current page number',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  current?: number = 1;

  @ApiProperty({ description: 'Page size', required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ description: 'Filter by user ID', required: false })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({ description: 'Filter by showtime ID', required: false })
  @IsOptional()
  @IsMongoId()
  showtimeId?: string;

  @ApiProperty({
    description: 'Filter by payment status',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  paymentStatus?: BookingStatus;

  @ApiProperty({ description: 'Search by booking code', required: false })
  @IsOptional()
  @IsString()
  bookingCode?: string;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ description: 'Sort order', required: false, default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
