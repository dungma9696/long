import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Movies')
@ApiBearerAuth('JWT-auth')
@Controller('admin/movies')
export class AdminMoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    const result = await this.moviesService.create(createMovieDto);
    return ApiResponseData.ok(result, 'Movie created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all movies with pagination.',
  })
  async findAll(@Query() query: FindAllMoviesDto) {
    const result = await this.moviesService.findAll(query);
    return ApiResponseData.ok(result, 'Movies retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiResponse({ status: 200, description: 'Return the movie.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.moviesService.findOne(id);
    return ApiResponseData.ok(result, 'Movie retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const result = await this.moviesService.update(id, updateMovieDto);
    return ApiResponseData.ok(result, 'Movie updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async remove(@Param('id') id: string) {
    await this.moviesService.remove(id);
    return ApiResponseData.ok(true, 'Movie deleted successfully');
  }
}
