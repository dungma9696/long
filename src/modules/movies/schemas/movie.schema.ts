import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MovieStatus } from '../../../enums/movie-status.enum';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }] })
  genres: Types.ObjectId[];

  @Prop()
  cast?: string;

  @Prop()
  director?: string;

  @Prop({ type: Date })
  releaseDate?: Date;

  @Prop({ type: Number })
  duration?: number; // in minutes

  @Prop({ type: Types.ObjectId, ref: 'File' })
  posterId?: Types.ObjectId;

  @Prop()
  trailerUrl?: string;

  @Prop()
  rating?: string;

  @Prop()
  type?: string; // 2D, 3D, IMAX

  @Prop()
  ageRating?: string; // G, PG, PG-13, R

  @Prop()
  nation?: string;

  @Prop({ type: String, enum: MovieStatus, default: MovieStatus.COMING_SOON })
  status: MovieStatus;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
