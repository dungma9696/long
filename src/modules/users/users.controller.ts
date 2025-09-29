import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Controller, Get, Patch, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/decorators';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('User Profile')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponses.profileGet()
  async getProfile(@Request() req) {
    const result = await this.usersService.findOne(req.user._id);
    return ApiResponseData.ok(result, 'Profile retrieved successfully');
  }

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponses.profileUpdate()
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const result = await this.usersService.updateProfile(
      req.user._id,
      updateProfileDto,
    );
    return ApiResponseData.ok(result, 'Profile updated successfully');
  }
}
