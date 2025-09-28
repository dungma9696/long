import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsNumber,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovieStatus } from '../../../enums/movie-status.enum';

export class CreateMovieDto {
  @ApiProperty({ description: 'Movie name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Movie description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Movie genres', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  genres?: string[];

  @ApiProperty({ description: 'Movie cast', required: false })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiProperty({ description: 'Movie director', required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ description: 'Release date', required: false })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiProperty({ description: 'Movie duration in minutes', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: 'Poster file ID', required: false })
  @IsOptional()
  @IsMongoId()
  posterId?: string;

  @ApiProperty({ description: 'Trailer URL', required: false })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({ description: 'Movie rating', required: false })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiProperty({ description: 'Movie type (2D, 3D, IMAX)', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Age rating (G, PG, PG-13, R)', required: false })
  @IsOptional()
  @IsString()
  ageRating?: string;

  @ApiProperty({ description: 'Movie nation', required: false })
  @IsOptional()
  @IsString()
  nation?: string;

  @ApiProperty({
    description: 'Movie status',
    enum: MovieStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;
}
