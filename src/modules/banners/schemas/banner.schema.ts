import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BannerStatus } from 'src/enums/banner-status.enum';

export type BannerDocument = HydratedDocument<Banner>;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'File', required: true })
  imageId: Types.ObjectId;

  @Prop()
  linkUrl?: string;

  @Prop({ type: String, enum: BannerStatus, default: BannerStatus.ACTIVE })
  status: BannerStatus;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
