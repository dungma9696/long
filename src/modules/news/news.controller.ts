import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published news' })
  @ApiResponse({ status: 200, description: 'Return all published news.' })
  async findAll() {
    const result = await this.newsService.findAllForClient();
    return ApiResponseData.ok(result, 'News retrieved successfully');
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest news' })
  @ApiResponse({ status: 200, description: 'Return latest published news.' })
  async getLatestNews() {
    const result = await this.newsService.getLatestNews();
    return ApiResponseData.ok(result, 'Latest news retrieved successfully');
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get news by slug' })
  @ApiResponse({ status: 200, description: 'Return the news.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async findBySlug(@Param('slug') slug: string) {
    const result = await this.newsService.findBySlug(slug);
    return ApiResponseData.ok(result, 'News retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news by id' })
  @ApiResponse({ status: 200, description: 'Return the news.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.newsService.findOne(id);
    return ApiResponseData.ok(result, 'News retrieved successfully');
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Increment view count' })
  @ApiResponse({ status: 200, description: 'View count incremented.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async incrementViewCount(@Param('id') id: string) {
    await this.newsService.incrementViewCount(id);
    return ApiResponseData.ok(true, 'View count incremented successfully');
  }
}
