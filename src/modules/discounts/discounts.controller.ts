import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active discounts' })
  @ApiResponse({ status: 200, description: 'Return all active discounts.' })
  findAll() {
    return this.discountsService.findActive();
  }

  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate discount code' })
  @ApiResponse({
    status: 200,
    description: 'Return discount validation result.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  validateDiscount(
    @Param('code') code: string,
    @Body('orderAmount') orderAmount: number,
  ) {
    return this.discountsService.validateDiscount(code, orderAmount);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by id' })
  @ApiResponse({ status: 200, description: 'Return the discount.' })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }
}
