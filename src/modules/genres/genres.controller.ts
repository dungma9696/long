import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active genres' })
  @ApiResponse({ status: 200, description: 'Return all active genres.' })
  async findAll() {
    const result = await this.genresService.findAll();
    return ApiResponseData.ok(result, 'Genres retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by id' })
  @ApiResponse({ status: 200, description: 'Return the genre.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.genresService.findOne(id);
    return ApiResponseData.ok(result, 'Genre retrieved successfully');
  }
}
