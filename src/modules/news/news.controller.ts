import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published news' })
  @ApiResponse({ status: 200, description: 'Return all published news.' })
  findAll() {
    return this.newsService.findAllForClient();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest news' })
  @ApiResponse({ status: 200, description: 'Return latest published news.' })
  getLatestNews() {
    return this.newsService.getLatestNews();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get news by slug' })
  @ApiResponse({ status: 200, description: 'Return the news.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news by id' })
  @ApiResponse({ status: 200, description: 'Return the news.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Increment view count' })
  @ApiResponse({ status: 200, description: 'View count incremented.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  incrementViewCount(@Param('id') id: string) {
    return this.newsService.incrementViewCount(id);
  }
}
