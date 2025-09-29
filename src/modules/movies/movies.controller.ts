import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies for client' })
  @ApiResponse({ status: 200, description: 'Return all movies for client.' })
  async findAllForClient() {
    const result = await this.moviesService.findAllForClient();
    return ApiResponseData.ok(result, 'Movies retrieved successfully');
  }

  @Get('now-showing')
  @ApiOperation({ summary: 'Get now showing movies' })
  @ApiResponse({ status: 200, description: 'Return now showing movies.' })
  async getNowShowing() {
    const result = await this.moviesService.getNowShowing();
    return ApiResponseData.ok(
      result,
      'Now showing movies retrieved successfully',
    );
  }

  @Get('coming-soon')
  @ApiOperation({ summary: 'Get coming soon movies' })
  @ApiResponse({ status: 200, description: 'Return coming soon movies.' })
  async getComingSoon() {
    const result = await this.moviesService.getComingSoon();
    return ApiResponseData.ok(
      result,
      'Coming soon movies retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiResponse({ status: 200, description: 'Return the movie.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.moviesService.findOne(id);
    return ApiResponseData.ok(result, 'Movie retrieved successfully');
  }
}
