import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { AdminGenresController } from './admin-genres.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  controllers: [GenresController, AdminGenresController],
  providers: [GenresService],
  exports: [GenresService],
})
export class GenresModule {}
