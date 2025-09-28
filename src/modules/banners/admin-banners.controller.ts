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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiResponseData } from 'src/common/bases/api-response';
import { ReorderBannersDto } from './dto/reorder-banners.dto';

@ApiTags('Admin - Banners Management')
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new banner' })
  async create(@Body() dto: CreateBannerDto) {
    const result = await this.bannersService.create(dto);
    return ApiResponseData.ok(result);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all banners' })
  async findAll() {
    const result = await this.bannersService.findAll();
    return ApiResponseData.ok(result);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get banner by id' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string) {
    const result = await this.bannersService.findOne(id);
    return ApiResponseData.ok(result);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update banner by id' })
  @ApiParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    const result = await this.bannersService.update(id, dto);
    return ApiResponseData.ok(result);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete banner by id' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string) {
    await this.bannersService.remove(id);
    return ApiResponseData.ok(true);
  }

  @Post('reorder')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reorder banners by ids' })
  async reorder(@Body() dto: ReorderBannersDto) {
    await this.bannersService.reorder(dto);
    return ApiResponseData.ok(true);
  }
}
