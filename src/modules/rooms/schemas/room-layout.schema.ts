import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomLayoutDocument = HydratedDocument<RoomLayout>;

@Schema({ timestamps: true })
export class RoomLayout {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  totalSeat: number;

  @Prop({ required: true, type: Number })
  regularSeat: number;

  @Prop({ type: Number, default: 0 })
  vipSeat: number;

  @Prop({ type: Number, default: 0 })
  coupleSeat: number;

  @Prop({ type: [[String]], required: true })
  seatLayout: string[][]; // 2D array representing seat positions
}

export const RoomLayoutSchema = SchemaFactory.createForClass(RoomLayout);
