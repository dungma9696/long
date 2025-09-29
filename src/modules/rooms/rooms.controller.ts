import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active rooms' })
  @ApiResponse({ status: 200, description: 'Return all active rooms.' })
  async findAll() {
    const result = await this.roomsService.findActive();
    return ApiResponseData.ok(result, 'Rooms retrieved successfully');
  }

  @Get('layouts')
  @ApiOperation({ summary: 'Get all room layouts' })
  @ApiResponse({ status: 200, description: 'Return all room layouts.' })
  async findAllRoomLayouts() {
    const result = await this.roomsService.findAllRoomLayouts();
    return ApiResponseData.ok(result, 'Room layouts retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.roomsService.findOne(id);
    return ApiResponseData.ok(result, 'Room retrieved successfully');
  }
}
