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
import { ApiResponseData } from 'src/common/bases/api-response';

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
  async createRoomLayout(@Body() createRoomLayoutDto: CreateRoomLayoutDto) {
    const result =
      await this.roomsService.createRoomLayout(createRoomLayoutDto);
    return ApiResponseData.ok(result, 'Room layout created successfully', 201);
  }

  @Get('layouts')
  @ApiOperation({ summary: 'Get all room layouts' })
  @ApiResponse({ status: 200, description: 'Return all room layouts.' })
  async findAllRoomLayouts() {
    const result = await this.roomsService.findAllRoomLayouts();
    return ApiResponseData.ok(result, 'Room layouts retrieved successfully');
  }

  @Get('layouts/:id')
  @ApiOperation({ summary: 'Get room layout by id' })
  @ApiResponse({ status: 200, description: 'Return the room layout.' })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  async findOneRoomLayout(@Param('id') id: string) {
    const result = await this.roomsService.findOneRoomLayout(id);
    return ApiResponseData.ok(result, 'Room layout retrieved successfully');
  }

  @Patch('layouts/:id')
  @ApiOperation({ summary: 'Update room layout' })
  @ApiResponse({
    status: 200,
    description: 'The room layout has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  async updateRoomLayout(
    @Param('id') id: string,
    @Body() updateRoomLayoutDto: Partial<CreateRoomLayoutDto>,
  ) {
    const result = await this.roomsService.updateRoomLayout(
      id,
      updateRoomLayoutDto,
    );
    return ApiResponseData.ok(result, 'Room layout updated successfully');
  }

  @Delete('layouts/:id')
  @ApiOperation({ summary: 'Delete room layout' })
  @ApiResponse({
    status: 200,
    description: 'The room layout has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room layout not found.' })
  async removeRoomLayout(@Param('id') id: string) {
    await this.roomsService.removeRoomLayout(id);
    return ApiResponseData.ok(true, 'Room layout deleted successfully');
  }

  // Room endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    const result = await this.roomsService.create(createRoomDto);
    return ApiResponseData.ok(result, 'Room created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Return all rooms.' })
  async findAll() {
    const result = await this.roomsService.findAll();
    return ApiResponseData.ok(result, 'Rooms retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.roomsService.findOne(id);
    return ApiResponseData.ok(result, 'Room retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    const result = await this.roomsService.update(id, updateRoomDto);
    return ApiResponseData.ok(result, 'Room updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({
    status: 200,
    description: 'The room has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return ApiResponseData.ok(true, 'Room deleted successfully');
  }
}
