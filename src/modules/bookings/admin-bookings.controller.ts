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
  findAll(@Query() query: FindAllBookingsDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/payment-status')
  @ApiOperation({ summary: 'Update booking payment status' })
  @ApiResponse({
    status: 200,
    description: 'The booking payment status has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  updatePaymentStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updatePaymentStatus(id, status);
  }
}
