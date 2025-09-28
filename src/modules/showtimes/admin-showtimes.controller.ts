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
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { FindAllShowtimesDto } from './dto/find-all-showtimes.dto';

@ApiTags('Admin - Showtimes')
@ApiBearerAuth('JWT-auth')
@Controller('admin/showtimes')
export class AdminShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({
    status: 201,
    description: 'The showtime has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes with filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all showtimes with pagination.',
  })
  findAll(@Query() query: FindAllShowtimesDto) {
    return this.showtimesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get showtime by id' })
  @ApiResponse({ status: 200, description: 'Return the showtime.' })
  @ApiResponse({ status: 404, description: 'Showtime not found.' })
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update showtime' })
  @ApiResponse({
    status: 200,
    description: 'The showtime has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Showtime not found.' })
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete showtime' })
  @ApiResponse({
    status: 200,
    description: 'The showtime has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Showtime not found.' })
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(id);
  }
}
