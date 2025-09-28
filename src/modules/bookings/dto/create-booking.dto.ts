import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsMongoId,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../../enums/booking-status.enum';

export class SeatDto {
  @ApiProperty({ description: 'Seat row' })
  @IsString()
  row: string;

  @ApiProperty({ description: 'Seat number' })
  @IsString()
  seat: string;

  @ApiProperty({ description: 'Seat price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Seat type', enum: ['regular', 'vip', 'couple'] })
  @IsEnum(['regular', 'vip', 'couple'])
  seatType: 'regular' | 'vip' | 'couple';
}

export class ComboDto {
  @ApiProperty({ description: 'Combo name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Combo quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Combo price' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateBookingDto {
  @ApiProperty({ description: 'Showtime ID' })
  @IsMongoId()
  showtime: string;

  @ApiProperty({ description: 'Selected seats', type: [SeatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];

  @ApiProperty({
    description: 'Selected combos',
    type: [ComboDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboDto)
  combo?: ComboDto[];

  @ApiProperty({ description: 'Discount ID', required: false })
  @IsOptional()
  @IsMongoId()
  discount?: string;
}
