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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomLayoutDto } from './dto/create-room-layout.dto';

@ApiTags('Admin - Rooms')
@ApiBearerAuth('JWT-auth')
@Controller('admin/rooms')
export class AdminRoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Room Layout endpoints
  @Post('layouts')
  @ApiOperation({ summary: 'Create a new room layout' })
  @ApiResponse({
    status: 201,
    description: 'The room layout has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createRoomLayout(@Body() createRoomLayoutDto: CreateRoomLayoutDto) {
    return this.roomsService.createRoomLayout(createRoomLayoutDto);
  }

  @Get('layouts')
  @ApiOperation({ summary: 'Get all room layouts' })
  @ApiResponse({ status: 200, description: 'Return all room layouts.' })
  findAllRoomLayouts() {
    return this.roomsService.findAllRoomLayouts();
  }

  @Get('layouts/:id')
  @ApiOperation({ summary: 'Get room layout by id' })
  @ApiResponse({ status: 200, description: 'Return the room layout.' })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  findOneRoomLayout(@Param('id') id: string) {
    return this.roomsService.findOneRoomLayout(id);
  }

  @Patch('layouts/:id')
  @ApiOperation({ summary: 'Update room layout' })
  @ApiResponse({
    status: 200,
    description: 'The room layout has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  updateRoomLayout(
    @Param('id') id: string,
    @Body() updateRoomLayoutDto: Partial<CreateRoomLayoutDto>,
  ) {
    return this.roomsService.updateRoomLayout(id, updateRoomLayoutDto);
  }

  @Delete('layouts/:id')
  @ApiOperation({ summary: 'Delete room layout' })
  @ApiResponse({
    status: 200,
    description: 'The room layout has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  removeRoomLayout(@Param('id') id: string) {
    return this.roomsService.removeRoomLayout(id);
  }

  // Room endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Return all rooms.' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
