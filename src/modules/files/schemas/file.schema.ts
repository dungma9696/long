import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  path: string;

  @Prop()
  description?: string;

  @Prop()
  uploadedBy?: string; // User ID who uploaded the file

  @Prop({ default: true })
  isActive: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
