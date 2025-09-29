import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindAllBookingsDto } from './dto/find-all-bookings.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings with filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all bookings with pagination.',
  })
  async findAll(@Query() query: FindAllBookingsDto) {
    const result = await this.bookingsService.findAll(query);
    return ApiResponseData.ok(result, 'Bookings retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.bookingsService.findOne(id);
    return ApiResponseData.ok(result, 'Booking retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const result = await this.bookingsService.update(id, updateBookingDto);
    return ApiResponseData.ok(result, 'Booking updated successfully');
  }

  @Patch(':id/payment-status')
  @ApiOperation({ summary: 'Update booking payment status' })
  @ApiResponse({
    status: 200,
    description: 'The booking payment status has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const result = await this.bookingsService.updatePaymentStatus(id, status);
    return ApiResponseData.ok(
      result,
      'Booking payment status updated successfully',
    );
  }
}
