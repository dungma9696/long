import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { ApiResponseData } from 'src/common/bases/api-response';
import { ReserveSeatsDto } from './dto/reserve-seats.dto';
import { BookSeatsDto } from './dto/book-seats.dto';

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

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get all seats for a showtime' })
  @ApiResponse({
    status: 200,
    description: 'Return all seats for the showtime.',
  })
  async getSeatsByShowtime(@Param('id') id: string) {
    const result = await this.showtimesService.getSeatsByShowtime(id);
    return ApiResponseData.ok(result, 'Seats retrieved successfully');
  }

  @Get(':id/seats/available')
  @ApiOperation({ summary: 'Get available seats for a showtime' })
  @ApiResponse({
    status: 200,
    description: 'Return available seats for the showtime.',
  })
  async getAvailableSeats(@Param('id') id: string) {
    const result = await this.showtimesService.getAvailableSeats(id);
    return ApiResponseData.ok(result, 'Available seats retrieved successfully');
  }

  @Get(':id/pricing')
  @ApiOperation({ summary: 'Get seat pricing for a showtime' })
  @ApiResponse({
    status: 200,
    description: 'Return seat pricing for the showtime.',
  })
  async getSeatPricing(@Param('id') id: string) {
    const result = await this.showtimesService.getSeatPricing(id);
    return ApiResponseData.ok(result, 'Seat pricing retrieved successfully');
  }

  @Post(':id/seats/reserve')
  @ApiOperation({ summary: 'Reserve seats for a showtime' })
  @ApiResponse({ status: 201, description: 'Seats reserved successfully.' })
  @ApiResponse({ status: 400, description: 'Some seats are not available.' })
  @ApiBearerAuth()
  async reserveSeats(
    @Param('id') showtimeId: string,
    @Body() reserveSeatsDto: ReserveSeatsDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponseData.error(
        'User not authenticated',
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.showtimesService.reserveSeats(
      showtimeId,
      reserveSeatsDto.seatIds,
      userId,
      reserveSeatsDto.expiresInMinutes,
    );
    return ApiResponseData.ok(result, 'Seats reserved successfully');
  }

  @Post(':id/seats/book')
  @ApiOperation({ summary: 'Book seats for a showtime' })
  @ApiResponse({ status: 201, description: 'Seats booked successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Some seats are not available for booking.',
  })
  @ApiBearerAuth()
  async bookSeats(
    @Param('id') showtimeId: string,
    @Body() bookSeatsDto: BookSeatsDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponseData.error(
        'User not authenticated',
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.showtimesService.bookSeats(
      showtimeId,
      bookSeatsDto.seatIds,
      userId,
      bookSeatsDto.bookingId,
    );
    return ApiResponseData.ok(result, 'Seats booked successfully');
  }

  @Post(':id/seats/release')
  @ApiOperation({ summary: 'Release reserved seats' })
  @ApiResponse({ status: 200, description: 'Seats released successfully.' })
  @ApiBearerAuth()
  async releaseReservedSeats(
    @Param('id') showtimeId: string,
    @Body() body: { seatIds: string[] },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponseData.error(
        'User not authenticated',
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.showtimesService.releaseReservedSeats(showtimeId, body.seatIds);
    return ApiResponseData.ok(null, 'Seats released successfully');
  }
}
