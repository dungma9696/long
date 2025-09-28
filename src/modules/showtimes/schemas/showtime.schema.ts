import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShowtimeDocument = HydratedDocument<Showtime>;

@Schema({ timestamps: true })
export class Showtime {
  @Prop({ type: Types.ObjectId, ref: 'Movie', required: true })
  movie: Types.ObjectId;

  @Prop({ required: true })
  cinema: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Date, required: true })
  showtime: Date;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Discount' })
  discount?: Types.ObjectId;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, default: 'active' })
  status: string;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);
