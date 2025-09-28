import {
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NewsStatus } from '../../../enums/news-status.enum';

export class CreateNewsDto {
  @ApiProperty({ description: 'News title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'News slug (auto-generated if not provided)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'News summary', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'News content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Author ID' })
  @IsMongoId()
  author: string;

  @ApiProperty({ description: 'News image file ID', required: false })
  @IsOptional()
  @IsMongoId()
  imageId?: string;

  @ApiProperty({
    description: 'News status',
    enum: NewsStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @ApiProperty({ description: 'News tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
