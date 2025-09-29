import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Genres')
@ApiBearerAuth('JWT-auth')
@Controller('admin/genres')
export class AdminGenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createGenreDto: CreateGenreDto) {
    const result = await this.genresService.create(createGenreDto);
    return ApiResponseData.ok(result, 'Genre created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres (including inactive)' })
  @ApiResponse({ status: 200, description: 'Return all genres.' })
  async findAll() {
    const result = await this.genresService.findAllForAdmin();
    return ApiResponseData.ok(result, 'Genres retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by id' })
  @ApiResponse({ status: 200, description: 'Return the genre.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.genresService.findOne(id);
    return ApiResponseData.ok(result, 'Genre retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update genre' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const result = await this.genresService.update(id, updateGenreDto);
    return ApiResponseData.ok(result, 'Genre updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete genre permanently' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async remove(@Param('id') id: string) {
    await this.genresService.remove(id);
    return ApiResponseData.ok(true, 'Genre deleted successfully');
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete genre (deactivate)' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully deactivated.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async softDelete(@Param('id') id: string) {
    await this.genresService.softDelete(id);
    return ApiResponseData.ok(true, 'Genre deactivated successfully');
  }
}
