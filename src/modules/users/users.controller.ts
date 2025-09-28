import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Controller, Get, Patch, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/decorators';

@ApiTags('User Profile')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponses.profileGet()
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user._id);
  }

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponses.profileUpdate()
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user._id, updateProfileDto);
  }
}
