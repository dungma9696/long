import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FindAllNewsDto } from './dto/find-all-news.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - News')
@ApiBearerAuth('JWT-auth')
@Controller('admin/news')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new news article' })
  @ApiResponse({
    status: 201,
    description: 'The news has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createNewsDto: CreateNewsDto) {
    const result = await this.newsService.create(createNewsDto);
    return ApiResponseData.ok(result, 'News created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news with filters' })
  @ApiResponse({ status: 200, description: 'Return all news with pagination.' })
  async findAll(@Query() query: FindAllNewsDto) {
    const result = await this.newsService.findAll(query);
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update news' })
  @ApiResponse({
    status: 200,
    description: 'The news has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const result = await this.newsService.update(id, updateNewsDto);
    return ApiResponseData.ok(result, 'News updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete news' })
  @ApiResponse({
    status: 200,
    description: 'The news has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  async remove(@Param('id') id: string) {
    await this.newsService.remove(id);
    return ApiResponseData.ok(true, 'News deleted successfully');
  }
}
