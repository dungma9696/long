import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  @ApiOperation({ summary: 'Get showtimes with filters' })
  @ApiResponse({
    status: 200,
    description: 'Return showtimes with pagination.',
  })
  @ApiQuery({
    name: 'movieId',
    required: false,
    description: 'Filter by movie ID',
  })
  @ApiQuery({
    name: 'cinema',
    required: false,
    description: 'Filter by cinema',
  })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date' })
  @ApiQuery({
    name: 'roomId',
    required: false,
    description: 'Filter by room ID',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async findAll(@Query() query: any) {
    const result = await this.showtimesService.findAll(query);
    return ApiResponseData.ok(result, 'Showtimes retrieved successfully');
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get showtimes by movie ID' })
  @ApiResponse({ status: 200, description: 'Return showtimes for the movie.' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date' })
  async getShowtimesByMovie(
    @Param('movieId') movieId: string,
    @Query('date') date?: string,
  ) {
    const result = await this.showtimesService.getShowtimesByMovie(
      movieId,
      date,
    );
    return ApiResponseData.ok(result, 'Showtimes retrieved successfully');
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get showtimes by date' })
  @ApiResponse({ status: 200, description: 'Return showtimes for the date.' })
  async getShowtimesByDate(@Param('date') date: string) {
    const result = await this.showtimesService.getShowtimesByDate(date);
    return ApiResponseData.ok(result, 'Showtimes retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get showtime by id' })
  @ApiResponse({ status: 200, description: 'Return the showtime.' })
  @ApiResponse({ status: 404, description: 'Showtime not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.showtimesService.findOne(id);
    return ApiResponseData.ok(result, 'Showtime retrieved successfully');
  }
}
