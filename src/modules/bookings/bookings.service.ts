import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindAllBookingsDto } from './dto/find-all-bookings.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { showtime, seats, combo = [], discount } = createBookingDto;

    // Calculate total amount
    const seatsTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    const comboTotal = combo.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let totalAmount = seatsTotal + comboTotal;

    // Apply discount if provided
    let discountAmount = 0;
    if (discount) {
      // Here you would fetch discount details and calculate discount amount
      // For now, we'll assume no discount calculation
    }

    totalAmount -= discountAmount;

    // Generate booking code
    const bookingCode = uuidv4().substring(0, 8).toUpperCase();

    const bookingData = {
      user: userId,
      showtime,
      seats,
      combo,
      totalAmount,
      discountAmount,
      discount,
      paymentStatus: 'pending',
      bookingTime: new Date().toISOString(),
      bookingCode,
      numberTicket: seats.length,
    };

    const createdBooking = new this.bookingModel(bookingData);
    return createdBooking.save();
  }

  async findAll(
    query: FindAllBookingsDto,
  ): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      userId,
      showtimeId,
      paymentStatus,
      bookingCode,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (userId) {
      filter.user = userId;
    }

    if (showtimeId) {
      filter.showtime = showtimeId;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (bookingCode) {
      filter.bookingCode = { $regex: bookingCode, $options: 'i' };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.bookingModel
        .find(filter)
        .populate('user', 'name email')
        .populate('showtime')
        .populate('discount', 'name code percent')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(filter).exec(),
    ]);

    return {
      bookings,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('user', 'name email')
      .populate('showtime')
      .populate('discount', 'name code percent')
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByCode(bookingCode: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findOne({ bookingCode })
      .populate('user', 'name email')
      .populate('showtime')
      .populate('discount', 'name code percent')
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .populate('user', 'name email')
      .populate('showtime')
      .populate('discount', 'name code percent')
      .exec();
    if (!updatedBooking) {
      throw new NotFoundException('Booking not found');
    }
    return updatedBooking;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Booking not found');
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ user: userId })
      .populate('showtime')
      .populate('discount', 'name code percent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updatePaymentStatus(id: string, status: string): Promise<Booking> {
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, { paymentStatus: status }, { new: true })
      .populate('user', 'name email')
      .populate('showtime')
      .populate('discount', 'name code percent')
      .exec();
    if (!updatedBooking) {
      throw new NotFoundException('Booking not found');
    }
    return updatedBooking;
  }
}
