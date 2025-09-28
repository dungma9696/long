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
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres (including inactive)' })
  @ApiResponse({ status: 200, description: 'Return all genres.' })
  findAll() {
    return this.genresService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by id' })
  @ApiResponse({ status: 200, description: 'Return the genre.' })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update genre' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete genre permanently' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Soft delete genre (deactivate)' })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully deactivated.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  softDelete(@Param('id') id: string) {
    return this.genresService.softDelete(id);
  }
}
