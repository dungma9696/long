import { IsArray, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookSeatsDto {
  @ApiProperty({
    description: 'Array of seat IDs to book',
    example: ['64a1b2c3d4e5f6789012345a', '64a1b2c3d4e5f6789012345b'],
  })
  @IsArray()
  @IsString({ each: true })
  seatIds: string[];

  @ApiProperty({
    description: 'Booking ID',
    example: '64a1b2c3d4e5f6789012345c',
  })
  @IsMongoId()
  bookingId: string;
}
