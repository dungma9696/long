import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { AdminShowtimesController } from './admin-showtimes.controller';
import { Showtime, ShowtimeSchema } from './schemas/showtime.schema';
import { Seat, SeatSchema } from './schemas/seat.schema';
import { SeatCleanupService } from './seat-cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Seat.name, schema: SeatSchema },
    ]),
  ],
  controllers: [ShowtimesController, AdminShowtimesController],
  providers: [ShowtimesService, SeatCleanupService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
