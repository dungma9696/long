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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Roles & Permissions')
@ApiBearerAuth('JWT-auth')
@Controller('admin/roles')
export class AdminRolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Permission endpoints
  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: 201,
    description: 'The permission has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const result =
      await this.rolesService.createPermission(createPermissionDto);
    return ApiResponseData.ok(result, 'Permission created successfully', 201);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions.' })
  async findAllPermissions() {
    const result = await this.rolesService.findAllPermissions();
    return ApiResponseData.ok(result, 'Permissions retrieved successfully');
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiResponse({ status: 200, description: 'Return the permission.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async findOnePermission(@Param('id') id: string) {
    const result = await this.rolesService.findOnePermission(id);
    return ApiResponseData.ok(result, 'Permission retrieved successfully');
  }

  @Patch('permissions/:id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const result = await this.rolesService.updatePermission(
      id,
      updatePermissionDto,
    );
    return ApiResponseData.ok(result, 'Permission updated successfully');
  }

  @Delete('permissions/:id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async removePermission(@Param('id') id: string) {
    await this.rolesService.removePermission(id);
    return ApiResponseData.ok(true, 'Permission deleted successfully');
  }

  // Role endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto);
    return ApiResponseData.ok(result, 'Role created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  async findAll() {
    const result = await this.rolesService.findAll();
    return ApiResponseData.ok(result, 'Roles retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, description: 'Return the role.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.rolesService.findOne(id);
    return ApiResponseData.ok(result, 'Role retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.rolesService.update(id, updateRoleDto);
    return ApiResponseData.ok(result, 'Role updated successfully');
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiResponse({
    status: 200,
    description: 'Permissions have been successfully assigned.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async assignPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    const result = await this.rolesService.assignPermissions(id, permissionIds);
    return ApiResponseData.ok(result, 'Permissions assigned successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return ApiResponseData.ok(true, 'Role deleted successfully');
  }
}
