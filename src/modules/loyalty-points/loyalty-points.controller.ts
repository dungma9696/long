import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoyaltyPointsService } from './loyalty-points.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Loyalty Points')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('loyalty-points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Get('my-points')
  @ApiOperation({ summary: 'Get current user loyalty points' })
  @ApiResponse({ status: 200, description: 'Return user loyalty points.' })
  async getMyPoints(@Request() req) {
    const result = await this.loyaltyPointsService.getUserLoyaltyPoints(
      req.user.id,
    );
    return ApiResponseData.ok(
      result,
      'User loyalty points retrieved successfully',
    );
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Get current user points history' })
  @ApiResponse({ status: 200, description: 'Return user points history.' })
  async getMyHistory(@Request() req) {
    const result = await this.loyaltyPointsService.getUserPointsHistory(
      req.user.id,
    );
    return ApiResponseData.ok(
      result,
      'User points history retrieved successfully',
    );
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
}
