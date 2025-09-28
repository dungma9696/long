import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BookingStatus } from '../../../enums/booking-status.enum';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Showtime', required: true })
  showtime: Types.ObjectId;

  @Prop({
    type: [
      {
        row: String,
        seat: String,
        price: Number,
        seatType: { type: String, enum: ['regular', 'vip', 'couple'] },
      },
    ],
    required: true,
  })
  seats: Array<{
    row: string;
    seat: string;
    price: number;
    seatType: 'regular' | 'vip' | 'couple';
  }>;

  @Prop({
    type: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    default: [],
  })
  combo: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  paymentStatus: BookingStatus;

  @Prop({ type: String, required: true })
  bookingTime: string;

  @Prop({ type: String, required: true, unique: true })
  bookingCode: string;

  @Prop({ type: Number, required: true })
  numberTicket: number;

  @Prop({ type: Types.ObjectId, ref: 'Discount' })
  discount?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
