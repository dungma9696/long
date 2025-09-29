import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoyaltyPointsService } from './loyalty-points.service';
import { AddPointsDto } from './dto/add-points.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Loyalty Points')
@ApiBearerAuth('JWT-auth')
@Controller('admin/loyalty-points')
export class AdminLoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loyalty points' })
  @ApiResponse({ status: 200, description: 'Return all loyalty points.' })
  async findAll() {
    const result = await this.loyaltyPointsService.getAllLoyaltyPoints();
    return ApiResponseData.ok(result, 'Loyalty points retrieved successfully');
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Get top users by loyalty points' })
  @ApiResponse({
    status: 200,
    description: 'Return top users by loyalty points.',
  })
  async getTopUsers() {
    const result = await this.loyaltyPointsService.getTopUsers();
    return ApiResponseData.ok(result, 'Top users retrieved successfully');
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user loyalty points by ID' })
  @ApiResponse({ status: 200, description: 'Return user loyalty points.' })
  @ApiResponse({ status: 404, description: 'User loyalty points not found.' })
  async getUserPoints(@Param('userId') userId: string) {
    const result = await this.loyaltyPointsService.getUserLoyaltyPoints(userId);
    return ApiResponseData.ok(
      result,
      'User loyalty points retrieved successfully',
    );
  }

  @Post('add-points')
  @ApiOperation({ summary: 'Add points to user' })
  @ApiResponse({
    status: 201,
    description: 'Points have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async addPoints(@Body() addPointsDto: AddPointsDto) {
    const result = await this.loyaltyPointsService.addPoints(addPointsDto);
    return ApiResponseData.ok(result, 'Points added successfully', 201);
  }
}
