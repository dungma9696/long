import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies for client' })
  @ApiResponse({ status: 200, description: 'Return all movies for client.' })
  findAllForClient() {
    return this.moviesService.findAllForClient();
  }

  @Get('now-showing')
  @ApiOperation({ summary: 'Get now showing movies' })
  @ApiResponse({ status: 200, description: 'Return now showing movies.' })
  getNowShowing() {
    return this.moviesService.getNowShowing();
  }

  @Get('coming-soon')
  @ApiOperation({ summary: 'Get coming soon movies' })
  @ApiResponse({ status: 200, description: 'Return coming soon movies.' })
  getComingSoon() {
    return this.moviesService.getComingSoon();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiResponse({ status: 200, description: 'Return the movie.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }
}
