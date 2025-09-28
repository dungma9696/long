import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const createdGenre = new this.genreModel(createGenreDto);
    return createdGenre.save();
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find({ isActive: true }).exec();
  }

  async findAllForAdmin(): Promise<Genre[]> {
    return this.genreModel.find().exec();
  }

  async findOne(id: string): Promise<Genre> {
    const genre = await this.genreModel.findById(id).exec();
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const updatedGenre = await this.genreModel
      .findByIdAndUpdate(id, updateGenreDto, { new: true })
      .exec();
    if (!updatedGenre) {
      throw new NotFoundException('Genre not found');
    }
    return updatedGenre;
  }

  async remove(id: string): Promise<void> {
    const result = await this.genreModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Genre not found');
    }
  }

  async softDelete(id: string): Promise<Genre> {
    const updatedGenre = await this.genreModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    if (!updatedGenre) {
      throw new NotFoundException('Genre not found');
    }
    return updatedGenre;
  }
}
