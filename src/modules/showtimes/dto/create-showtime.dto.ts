import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'Ticket price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Showtime status',
    required: false,
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
