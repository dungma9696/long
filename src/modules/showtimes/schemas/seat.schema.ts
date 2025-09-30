import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SeatStatus } from '../../../enums/seat-status.enum';

export type SeatDocument = HydratedDocument<Seat>;

@Schema({ timestamps: true })
export class Seat {
  @Prop({ type: Types.ObjectId, ref: 'Showtime', required: true })
  showtime: Types.ObjectId;

  @Prop({ required: true })
  row: string;

  @Prop({ required: true })
  seatNumber: string;

  @Prop({
    type: String,
    enum: ['regular', 'vip', 'couple'],
    required: true,
  })
  seatType: 'regular' | 'vip' | 'couple';

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: String,
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  bookedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking' })
  booking?: Types.ObjectId;

  @Prop({ type: Date })
  bookedAt?: Date;

  @Prop({ type: Date })
  expiresAt?: Date; // For reserved seats
}

export const SeatSchema = SchemaFactory.createForClass(Seat);

// Create compound index for showtime, row, and seatNumber
SeatSchema.index({ showtime: 1, row: 1, seatNumber: 1 }, { unique: true });
