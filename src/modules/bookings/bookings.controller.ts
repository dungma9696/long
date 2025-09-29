import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    const result = await this.bookingsService.create(
      createBookingDto,
      req.user.id,
    );
    return ApiResponseData.ok(result, 'Booking created successfully', 201);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Return user bookings.' })
  async getMyBookings(@Request() req) {
    const result = await this.bookingsService.getUserBookings(req.user.id);
    return ApiResponseData.ok(result, 'User bookings retrieved successfully');
  }

  @Get('code/:bookingCode')
  @ApiOperation({ summary: 'Get booking by code' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async findByCode(@Param('bookingCode') bookingCode: string) {
    const result = await this.bookingsService.findByCode(bookingCode);
    return ApiResponseData.ok(result, 'Booking retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.bookingsService.findOne(id);
    return ApiResponseData.ok(result, 'Booking retrieved successfully');
  }
}
