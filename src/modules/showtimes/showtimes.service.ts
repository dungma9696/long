import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Showtime, ShowtimeDocument } from './schemas/showtime.schema';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { FindAllShowtimesDto } from './dto/find-all-showtimes.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectModel(Showtime.name) private showtimeModel: Model<ShowtimeDocument>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const createdShowtime = new this.showtimeModel(createShowtimeDto);
    return createdShowtime.save();
  }

  async findAll(
    query: FindAllShowtimesDto,
  ): Promise<{
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
}
