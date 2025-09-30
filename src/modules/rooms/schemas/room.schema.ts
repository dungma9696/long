import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoomStatus } from '../../../enums/room-status.enum';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'RoomLayout', required: true })
  roomLayout: Types.ObjectId;

  @Prop()
  format?: string; // 2D, 3D, IMAX

  @Prop({ type: String, enum: RoomStatus, default: RoomStatus.ACTIVE })
  status: RoomStatus;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
