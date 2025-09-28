import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyPointsService } from './loyalty-points.service';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { AdminLoyaltyPointsController } from './admin-loyalty-points.controller';
import {
  LoyaltyPoint,
  LoyaltyPointSchema,
} from './schemas/loyalty-point.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoyaltyPoint.name, schema: LoyaltyPointSchema },
    ]),
  ],
  controllers: [LoyaltyPointsController, AdminLoyaltyPointsController],
  providers: [LoyaltyPointsService],
  exports: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
