import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active rooms' })
  @ApiResponse({ status: 200, description: 'Return all active rooms.' })
  findAll() {
    return this.roomsService.findActive();
  }

  @Get('layouts')
  @ApiOperation({ summary: 'Get all room layouts' })
  @ApiResponse({ status: 200, description: 'Return all room layouts.' })
  findAllRoomLayouts() {
    return this.roomsService.findAllRoomLayouts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }
}
