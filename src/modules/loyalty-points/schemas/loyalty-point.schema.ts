import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TPointHistory = {
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description: string;
  bookingId?: Types.ObjectId;
  createdAt: Date;
};

export type LoyaltyPointDocument = HydratedDocument<LoyaltyPoint>;

@Schema({ timestamps: true })
export class LoyaltyPoint {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        type: { type: String, enum: ['earn', 'redeem', 'expire'] },
        points: Number,
        description: String,
        bookingId: { type: Types.ObjectId, ref: 'Booking' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  pointsHistory: Array<TPointHistory>;

  @Prop({ type: Number, default: 0 })
  currentTotalPoints: number;

  @Prop()
  description?: string;
}

export const LoyaltyPointSchema = SchemaFactory.createForClass(LoyaltyPoint);
