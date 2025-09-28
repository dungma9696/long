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
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, description: 'Return all discounts.' })
  findAll() {
    return this.discountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by id' })
  @ApiResponse({ status: 200, description: 'Return the discount.' })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update discount' })
  @ApiResponse({
    status: 200,
    description: 'The discount has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discount' })
  @ApiResponse({
    status: 200,
    description: 'The discount has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Discount not found.' })
  remove(@Param('id') id: string) {
    return this.discountsService.remove(id);
  }
}
