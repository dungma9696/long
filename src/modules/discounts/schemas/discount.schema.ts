import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DiscountStatus } from '../../../enums/discount-status.enum';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true })
export class Discount {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, type: Number, min: 0, max: 100 })
  percent: number;

  @Prop({ type: Number })
  maxDiscount?: number; // Maximum discount amount

  @Prop({ type: Number })
  minOrderAmount?: number; // Minimum order amount to apply discount

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Number, default: 0 })
  usageLimit?: number; // 0 means unlimited

  @Prop({ type: Number, default: 0 })
  usedCount: number;

  @Prop({ type: String, enum: DiscountStatus, default: DiscountStatus.ACTIVE })
  status: DiscountStatus;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
