import { IsString, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomLayoutDto {
  @ApiProperty({ description: 'Room layout name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Total number of seats' })
  @IsNumber()
  @Min(1)
  totalSeat: number;

  @ApiProperty({ description: 'Number of regular seats' })
  @IsNumber()
  @Min(0)
  regularSeat: number;

  @ApiProperty({
    description: 'Number of VIP seats',
    required: false,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  vipSeat?: number = 0;

  @ApiProperty({
    description: 'Number of couple seats',
    required: false,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  coupleSeat?: number = 0;

  @ApiProperty({
    description: '2D array representing seat layout',
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsArray({ each: true })
  seatLayout: string[][];
}
