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

@ApiTags('Loyalty Points')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('loyalty-points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Get('my-points')
  @ApiOperation({ summary: 'Get current user loyalty points' })
  @ApiResponse({ status: 200, description: 'Return user loyalty points.' })
  getMyPoints(@Request() req) {
    return this.loyaltyPointsService.getUserLoyaltyPoints(req.user.id);
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Get current user points history' })
  @ApiResponse({ status: 200, description: 'Return user points history.' })
  getMyHistory(@Request() req) {
    return this.loyaltyPointsService.getUserPointsHistory(req.user.id);
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Get top users by loyalty points' })
  @ApiResponse({
    status: 200,
    description: 'Return top users by loyalty points.',
  })
  getTopUsers() {
    return this.loyaltyPointsService.getTopUsers();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user loyalty points by ID' })
  @ApiResponse({ status: 200, description: 'Return user loyalty points.' })
  @ApiResponse({ status: 404, description: 'User loyalty points not found.' })
  getUserPoints(@Param('userId') userId: string) {
    return this.loyaltyPointsService.getUserLoyaltyPoints(userId);
  }
}
