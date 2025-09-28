import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount, DiscountDocument } from './schemas/discount.schema';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountStatus } from 'src/enums/discount-status.enum';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<DiscountDocument>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    // Check if code already exists
    const existingDiscount = await this.discountModel
      .findOne({ code: createDiscountDto.code })
      .exec();
    if (existingDiscount) {
      throw new BadRequestException('Discount code already exists');
    }

    const createdDiscount = new this.discountModel(createDiscountDto);
    return createdDiscount.save();
  }

  async findAll(): Promise<Discount[]> {
    return this.discountModel.find().exec();
  }

  async findActive(): Promise<Discount[]> {
    const now = new Date();
    return this.discountModel
      .find({
        status: 'active',
        $or: [
          { startDate: { $exists: false } },
          { startDate: { $lte: now } },
          { endDate: { $exists: false } },
          { endDate: { $gte: now } },
        ],
      })
      .exec();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountModel.findById(id).exec();
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }

  async findByCode(code: string): Promise<Discount> {
    const discount = await this.discountModel.findOne({ code }).exec();
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }

  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    // Check if code already exists (excluding current discount)
    if (updateDiscountDto.code) {
      const existingDiscount = await this.discountModel
        .findOne({
          code: updateDiscountDto.code,
          _id: { $ne: id },
        })
        .exec();
      if (existingDiscount) {
        throw new BadRequestException('Discount code already exists');
      }
    }

    const updatedDiscount = await this.discountModel
      .findByIdAndUpdate(id, updateDiscountDto, { new: true })
      .exec();
    if (!updatedDiscount) {
      throw new NotFoundException('Discount not found');
    }
    return updatedDiscount;
  }

  async remove(id: string): Promise<void> {
    const result = await this.discountModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Discount not found');
    }
  }

  async validateDiscount(
    code: string,
    orderAmount: number,
  ): Promise<{ valid: boolean; discount?: Discount; message?: string }> {
    const discount = await this.discountModel.findOne({ code }).exec();

    if (!discount) {
      return { valid: false, message: 'Discount code not found' };
    }

    if (discount.status !== DiscountStatus.ACTIVE) {
      return { valid: false, message: 'Discount code is not active' };
    }

    const now = new Date();
    if (discount.startDate && discount.startDate > now) {
      return { valid: false, message: 'Discount code is not yet active' };
    }

    if (discount.endDate && discount.endDate < now) {
      return { valid: false, message: 'Discount code has expired' };
    }

    if (
      typeof discount?.usageLimit === 'number' &&
      discount.usageLimit > 0 &&
      discount.usedCount >= discount.usageLimit
    ) {
      return { valid: false, message: 'Discount code usage limit exceeded' };
    }

    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ${discount.minOrderAmount}`,
      };
    }

    return { valid: true, discount };
  }

  async incrementUsage(id: string): Promise<void> {
    await this.discountModel
      .findByIdAndUpdate(id, { $inc: { usedCount: 1 } })
      .exec();
  }
}
