import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMoviesDto } from './dto/find-all-movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async findAll(query: FindAllMoviesDto): Promise<{
    movies: Movie[];
    total: number;
    current: number;
    pageSize: number;
  }> {
    const {
      current = 1,
      pageSize = 10,
      search,
      status,
      genreId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    if (genreId) {
      filter.genres = genreId;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (current - 1) * pageSize;

    const [movies, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .populate('genres', 'name')
        .populate('posterId')
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.movieModel.countDocuments(filter).exec(),
    ]);

    return {
      movies,
      total,
      current,
      pageSize,
    };
  }

  async findAllForClient(): Promise<Movie[]> {
    return this.movieModel
      .find({ status: { $in: ['now_showing', 'coming_soon'] } })
      .populate('genres', 'name')
      .populate('posterId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel
      .findById(id)
      .populate('genres', 'name')
      .populate('posterId')
      .exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .populate('genres', 'name')
      .populate('posterId')
      .exec();
    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }
    return updatedMovie;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Movie not found');
    }
  }

  async getNowShowing(): Promise<Movie[]> {
    return this.movieModel
      .find({ status: 'now_showing' })
      .populate('genres', 'name')
      .populate('posterId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getComingSoon(): Promise<Movie[]> {
    return this.movieModel
      .find({ status: 'coming_soon' })
      .populate('genres', 'name')
      .populate('posterId')
      .sort({ releaseDate: 1 })
      .exec();
  }
}
