import {
  IsString,
  IsOptional,
  IsDateString,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PricingDto } from './pricing.dto';

export class CreateShowtimeDto {
  @ApiProperty({ description: 'Movie ID' })
  @IsMongoId()
  movie: string;

  @ApiProperty({ description: 'Cinema name' })
  @IsString()
  cinema: string;

  @ApiProperty({ description: 'Cinema address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Showtime date and time' })
  @IsDateString()
  showtime: string;

  @ApiProperty({ description: 'Show date' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Room ID' })
  @IsMongoId()
  room: string;

  @ApiProperty({ description: 'Discount ID', required: false })
  @IsOptional()
  @IsMongoId()
  discount?: string;

  @ApiProperty({
    description: 'Pricing for different seat types',
    type: PricingDto,
  })
  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;

  @ApiProperty({
    description: 'Showtime status',
    required: false,
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
