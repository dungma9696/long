import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Showtime, ShowtimeDocument } from './schemas/showtime.schema';
import { Seat, SeatDocument } from './schemas/seat.schema';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { FindAllShowtimesDto } from './dto/find-all-showtimes.dto';
import { SeatStatus } from '../../enums/seat-status.enum';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectModel(Showtime.name) private showtimeModel: Model<ShowtimeDocument>,
    @InjectModel(Seat.name) private seatModel: Model<SeatDocument>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const createdShowtime = new this.showtimeModel(createShowtimeDto);
    const savedShowtime = await createdShowtime.save();

    // Initialize seats for the showtime
    await this.initializeSeatsForShowtime(
      savedShowtime._id,
      createShowtimeDto.room,
    );

    return savedShowtime;
  }

  async findAll(query: FindAllShowtimesDto): Promise<{
    showtimes: Showtime[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      movieId,
      cinema,
      date,
      roomId,
      sortBy = 'showtime',
      sortOrder = 'asc',
    } = query;

    const filter: any = {};

    if (movieId) {
      filter.movie = movieId;
    }

    if (cinema) {
      filter.cinema = { $regex: cinema, $options: 'i' };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    if (roomId) {
      filter.room = roomId;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [showtimes, total] = await Promise.all([
      this.showtimeModel
        .find(filter)
        .populate('movie', 'name posterId duration')
        .populate('room', 'name format')
        .populate('discount', 'name code percent')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.showtimeModel.countDocuments(filter).exec(),
    ]);

    return {
      showtimes,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Showtime> {
    const showtime = await this.showtimeModel
      .findById(id)
      .populate('movie', 'name posterId duration')
      .populate('room', 'name format seatLayout')
      .populate('discount', 'name code percent')
      .exec();
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }

  async update(
    id: string,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const updatedShowtime = await this.showtimeModel
      .findByIdAndUpdate(id, updateShowtimeDto, { new: true })
      .populate('movie', 'name posterId duration')
      .populate('room', 'name format')
      .populate('discount', 'name code percent')
      .exec();
    if (!updatedShowtime) {
      throw new NotFoundException('Showtime not found');
    }
    return updatedShowtime;
  }

  async remove(id: string): Promise<void> {
    const result = await this.showtimeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Showtime not found');
    }
  }

  async getShowtimesByMovie(
    movieId: string,
    date?: string,
  ): Promise<Showtime[]> {
    const filter: any = { movie: movieId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    return this.showtimeModel
      .find(filter)
      .populate('movie', 'name posterId duration')
      .populate('room', 'name format')
      .populate('discount', 'name code percent')
      .sort({ showtime: 1 })
      .exec();
  }

  async getShowtimesByDate(date: string): Promise<Showtime[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.showtimeModel
      .find({
        date: { $gte: startDate, $lt: endDate },
        status: 'active',
      })
      .populate('movie', 'name posterId duration')
      .populate('room', 'name format')
      .populate('discount', 'name code percent')
      .sort({ showtime: 1 })
      .exec();
  }

  // Seat management methods
  async initializeSeatsForShowtime(
    showtimeId: Types.ObjectId,
    roomId: string,
  ): Promise<void> {
    // Get room layout to understand seat configuration
    const room = await this.showtimeModel.db
      .collection('rooms')
      .findOne({ _id: new Types.ObjectId(roomId) });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const roomLayout = await this.showtimeModel.db
      .collection('roomlayouts')
      .findOne({ _id: room.roomLayout });
    if (!roomLayout) {
      throw new NotFoundException('Room layout not found');
    }

    const showtime = await this.showtimeModel.findById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Parse seat layout and create seats
    const seatLayout = JSON.parse(roomLayout.seatLayout);
    const seats: any[] = [];

    for (const row of seatLayout) {
      for (const seat of row.seats) {
        let seatType: 'regular' | 'vip' | 'couple' = 'regular';
        let price = showtime.pricing.regular;

        if (seat.type === 'vip') {
          seatType = 'vip';
          price = showtime.pricing.vip;
        } else if (seat.type === 'couple') {
          seatType = 'couple';
          price = showtime.pricing.couple;
        }

        seats.push({
          showtime: showtimeId,
          row: row.row,
          seatNumber: seat.number,
          seatType,
          price,
          status: SeatStatus.AVAILABLE,
        });
      }
    }

    if (seats.length > 0) {
      await this.seatModel.insertMany(seats);
    }
  }

  async getSeatsByShowtime(showtimeId: string): Promise<Seat[]> {
    return this.seatModel
      .find({ showtime: new Types.ObjectId(showtimeId) })
      .sort({ row: 1, seatNumber: 1 })
      .exec();
  }

  async getAvailableSeats(showtimeId: string): Promise<Seat[]> {
    return this.seatModel
      .find({
        showtime: new Types.ObjectId(showtimeId),
        status: SeatStatus.AVAILABLE,
      })
      .sort({ row: 1, seatNumber: 1 })
      .exec();
  }

  async reserveSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    expiresInMinutes: number = 15,
  ): Promise<Seat[]> {
    const session = await this.seatModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Check if seats are available
        const seats = await this.seatModel
          .find({
            _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
            showtime: new Types.ObjectId(showtimeId),
            status: SeatStatus.AVAILABLE,
          })
          .session(session);

        if (seats.length !== seatIds.length) {
          throw new BadRequestException('Some seats are not available');
        }

        // Reserve seats
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

        await this.seatModel
          .updateMany(
            { _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) } },
            {
              $set: {
                status: SeatStatus.RESERVED,
                bookedBy: new Types.ObjectId(userId),
                expiresAt,
              },
            },
          )
          .session(session);
      });

      return this.seatModel.find({
        _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
      });
    } finally {
      await session.endSession();
    }
  }

  async bookSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    bookingId: string,
  ): Promise<Seat[]> {
    const session = await this.seatModel.db.startSession();

    try {
      await session.withTransaction(async () => {
        // Check if seats are available or reserved by the same user
        const seats = await this.seatModel
          .find({
            _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
            showtime: new Types.ObjectId(showtimeId),
            $or: [
              { status: SeatStatus.AVAILABLE },
              {
                status: SeatStatus.RESERVED,
                bookedBy: new Types.ObjectId(userId),
                expiresAt: { $gt: new Date() },
              },
            ],
          })
          .session(session);

        if (seats.length !== seatIds.length) {
          throw new BadRequestException(
            'Some seats are not available for booking',
          );
        }

        // Book seats
        await this.seatModel
          .updateMany(
            { _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) } },
            {
              $set: {
                status: SeatStatus.BOOKED,
                bookedBy: new Types.ObjectId(userId),
                booking: new Types.ObjectId(bookingId),
                bookedAt: new Date(),
              },
              $unset: { expiresAt: 1 },
            },
          )
          .session(session);
      });

      return this.seatModel.find({
        _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
      });
    } finally {
      await session.endSession();
    }
  }

  async releaseReservedSeats(
    showtimeId: string,
    seatIds: string[],
  ): Promise<void> {
    await this.seatModel.updateMany(
      {
        _id: { $in: seatIds.map((id) => new Types.ObjectId(id)) },
        showtime: new Types.ObjectId(showtimeId),
        status: SeatStatus.RESERVED,
      },
      {
        $set: { status: SeatStatus.AVAILABLE },
        $unset: { bookedBy: 1, expiresAt: 1 },
      },
    );
  }

  async releaseExpiredReservations(): Promise<void> {
    await this.seatModel.updateMany(
      {
        status: SeatStatus.RESERVED,
        expiresAt: { $lt: new Date() },
      },
      {
        $set: { status: SeatStatus.AVAILABLE },
        $unset: { bookedBy: 1, expiresAt: 1 },
      },
    );
  }

  async getSeatPricing(
    showtimeId: string,
  ): Promise<{ regular: number; vip: number; couple: number }> {
    const showtime = await this.showtimeModel.findById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }
    return showtime.pricing;
  }
}
