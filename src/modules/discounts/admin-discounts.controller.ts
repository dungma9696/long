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
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Admin - Discounts')
@ApiBearerAuth('JWT-auth')
@Controller('admin/discounts')
export class AdminDiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discount' })
  @ApiResponse({
    status: 201,
    description: 'The discount has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    const result = await this.discountsService.create(createDiscountDto);
    return ApiResponseData.ok(result, 'Discount created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, description: 'Return all discounts.' })
  async findAll() {
    const result = await this.discountsService.findAll();
    return ApiResponseData.ok(result, 'Discounts retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by id' })
  @ApiResponse({ status: 200, description: 'Return the discount.' })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.discountsService.findOne(id);
    return ApiResponseData.ok(result, 'Discount retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update discount' })
  @ApiResponse({
    status: 200,
    description: 'The discount has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    const result = await this.discountsService.update(id, updateDiscountDto);
    return ApiResponseData.ok(result, 'Discount updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discount' })
  @ApiResponse({
    status: 200,
    description: 'The discount has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  async remove(@Param('id') id: string) {
    await this.discountsService.remove(id);
    return ApiResponseData.ok(true, 'Discount deleted successfully');
  }
}
