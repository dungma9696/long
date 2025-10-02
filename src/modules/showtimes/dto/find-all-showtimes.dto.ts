import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllShowtimesDto {
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

  @ApiProperty({ description: 'Filter by movie ID', required: false })
  @IsOptional()
  @IsMongoId()
  movieId?: string;

  @ApiProperty({ description: 'Filter by cinema', required: false })
  @IsOptional()
  @IsString()
  cinema?: string;

  @ApiProperty({ description: 'Filter by date', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Filter by room ID', required: false })
  @IsOptional()
  @IsMongoId()
  roomId?: string;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    default: 'showtime',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'showtime';

  @ApiProperty({ description: 'Sort order', required: false, default: 'asc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}
