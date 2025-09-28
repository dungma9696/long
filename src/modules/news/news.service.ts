import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FindAllNewsDto } from './dto/find-all-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    // Generate slug if not provided
    if (!createNewsDto.slug) {
      createNewsDto.slug = this.generateSlug(createNewsDto.title);
    }

    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(
    query: FindAllNewsDto,
  ): Promise<{ news: News[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.newsModel
        .find(filter)
        .populate('author', 'name email')
        .populate('imageId')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.newsModel.countDocuments(filter).exec(),
    ]);

    return {
      news,
      total,
      page,
      limit,
    };
  }

  async findAllForClient(): Promise<News[]> {
    return this.newsModel
      .find({ status: 'published' })
      .populate('author', 'name')
      .populate('imageId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsModel
      .findById(id)
      .populate('author', 'name email')
      .populate('imageId')
      .exec();
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.newsModel
      .findOne({ slug })
      .populate('author', 'name email')
      .populate('imageId')
      .exec();
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    // Generate slug if title is updated and slug is not provided
    if (updateNewsDto.title && !updateNewsDto.slug) {
      updateNewsDto.slug = this.generateSlug(updateNewsDto.title);
    }

    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .populate('author', 'name email')
      .populate('imageId')
      .exec();
    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }
    return updatedNews;
  }

  async remove(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('News not found');
    }
  }

  async incrementViewCount(id: string): Promise<News> {
    const news = await this.newsModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
      .populate('author', 'name email')
      .populate('imageId')
      .exec();
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async getLatestNews(limit: number = 5): Promise<News[]> {
    return this.newsModel
      .find({ status: 'published' })
      .populate('author', 'name')
      .populate('imageId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
