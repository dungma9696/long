import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShowtimesService } from './showtimes.service';

@Injectable()
export class SeatCleanupService {
  private readonly logger = new Logger(SeatCleanupService.name);

  constructor(private readonly showtimesService: ShowtimesService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations() {
    try {
      await this.showtimesService.releaseExpiredReservations();
      this.logger.log('Expired seat reservations cleaned up');
    } catch (error) {
      this.logger.error('Error cleaning up expired reservations:', error);
    }
  }
}
