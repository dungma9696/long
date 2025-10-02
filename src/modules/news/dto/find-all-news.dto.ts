import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NewsStatus } from '../../../enums/news-status.enum';

export class FindAllNewsDto {
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

  @ApiProperty({ description: 'Search by title or content', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by status',
    enum: NewsStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @ApiProperty({ description: 'Filter by tag', required: false })
  @IsOptional()
  @IsString()
  tag?: string;

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
