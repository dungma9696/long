import {
  IsArray,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveSeatsDto {
  @ApiProperty({
    description: 'Array of seat IDs to reserve',
    example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
  })
  @IsArray()
  @IsString({ each: true })
  seatIds: string[];

  @ApiProperty({
    description: 'Reservation expiration time in minutes',
    required: false,
    default: 15,
    minimum: 5,
    maximum: 60,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(60)
  expiresInMinutes?: number;
}
