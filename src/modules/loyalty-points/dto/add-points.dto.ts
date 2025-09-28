import {
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPointsDto {
  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'Points amount' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: ['earn', 'redeem', 'expire'],
  })
  @IsEnum(['earn', 'redeem', 'expire'])
  type: 'earn' | 'redeem' | 'expire';

  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Related booking ID', required: false })
  @IsOptional()
  @IsMongoId()
  bookingId?: string;
}
