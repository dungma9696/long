import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserByIdDto } from './dto/update-user-by-id.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Users Management')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // todo
  @Public()
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ApiResponseData.ok(user);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Get all users with pagination, filtering, sorting and search (Admin only)',
    description:
      'Retrieve users with support for status filtering, sorting by creation/update date, and text search on name and email fields',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiQuery({
    name: 'current',
    required: false,
    description: 'Current page number',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by user status (ACTIVE, INACTIVE)',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Sort field (createdAt, updatedAt)',
    enum: ['createdAt', 'updatedAt'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc, desc)',
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search text for name, phone and email fields',
    example: 'john',
  })
  async findAll(@Query() query: FindAllUsersDto) {
    const users = await this.usersService.findAll(query);
    return ApiResponseData.ok(users);
  }

  //   @Post('profile')
  //   @ApiBearerAuth('JWT-auth')
  //   @ApiOperation({ summary: 'Get user profile by ID (Admin only)' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'User profile retrieved successfully',
  //   })
  //   @ApiResponse({ status: 404, description: 'User not found' })
  //   @ApiResponse({ status: 401, description: 'Unauthorized' })
  //   @ApiResponse({
  //     status: 403,
  //     description: 'Forbidden - Admin access required',
  //   })
  //   getUserProfile(@Body() body: { _id: string }) {
  //     return this.usersService.findOne(+body._id);
  //   }

  //   @Patch('profile')
  //   @ApiBearerAuth('JWT-auth')
  //   @ApiOperation({ summary: 'Update user profile by ID (Admin only)' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'User profile updated successfully',
  //   })
  //   @ApiResponse({ status: 400, description: 'Bad request' })
  //   @ApiResponse({ status: 401, description: 'Unauthorized' })
  //   @ApiResponse({
  //     status: 403,
  //     description: 'Forbidden - Admin access required',
  //   })
  //   updateUserProfile(@Body() updateUserDto: UpdateUserDto) {
  //     return this.usersService.update(updateUserDto);
  //   }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: ExpressRequest & { user: { _id: string } }) {
    console.log('da vao req.user._id', req.user._id);
    const user = await this.usersService.findOne(req.user._id);
    return ApiResponseData.ok(user);
  }

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Request() req: ExpressRequest & { user: { _id: string } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(
      req.user._id,
      updateProfileDto,
    );
    return ApiResponseData.ok(user);
  }

  // @Patch()
  // @ApiBearerAuth('JWT-auth')
  // @ApiOperation({ summary: 'Update any user information (Admin only)' })
  // @ApiResponse({ status: 200, description: 'User updated successfully' })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden - Admin access required',
  // })
  // async update(@Body() updateUserDto: UpdateUserDto) {
  //   const user = await this.usersService.update(updateUserDto);
  //   return ApiResponseData.ok(user);
  // }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateById(
    @Param('id') id: string,
    @Body() updateUserByIdDto: UpdateUserByIdDto,
  ) {
    const user = await this.usersService.updateById(id, updateUserByIdDto);
    return ApiResponseData.ok(user);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return ApiResponseData.ok(user);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return ApiResponseData.ok(user);
  }
}
