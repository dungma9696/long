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
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news with filters' })
  @ApiResponse({ status: 200, description: 'Return all news with pagination.' })
  findAll(@Query() query: FindAllNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news by id' })
  @ApiResponse({ status: 200, description: 'Return the news.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update news' })
  @ApiResponse({
    status: 200,
    description: 'The news has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete news' })
  @ApiResponse({
    status: 200,
    description: 'The news has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'News not found.' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
