import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ApiResponseData } from 'src/common/bases/api-response';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active discounts' })
  @ApiResponse({ status: 200, description: 'Return all active discounts.' })
  async findAll() {
    const result = await this.discountsService.findActive();
    return ApiResponseData.ok(result, 'Discounts retrieved successfully');
  }

  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate discount code' })
  @ApiResponse({
    status: 200,
    description: 'Return discount validation result.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  async validateDiscount(
    @Param('code') code: string,
    @Body('orderAmount') orderAmount: number,
  ) {
    const result = await this.discountsService.validateDiscount(
      code,
      orderAmount,
    );
    return ApiResponseData.ok(result, 'Discount validation completed');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by id' })
  @ApiResponse({ status: 200, description: 'Return the discount.' })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.discountsService.findOne(id);
    return ApiResponseData.ok(result, 'Discount retrieved successfully');
  }
}
