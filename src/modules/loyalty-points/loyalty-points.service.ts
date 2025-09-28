import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoyaltyPoint,
  LoyaltyPointDocument,
  TPointHistory,
} from './schemas/loyalty-point.schema';
import { AddPointsDto } from './dto/add-points.dto';

@Injectable()
export class LoyaltyPointsService {
  constructor(
    @InjectModel(LoyaltyPoint.name)
    private loyaltyPointModel: Model<LoyaltyPointDocument>,
  ) {}

  async createOrGetUserLoyaltyPoints(userId: string): Promise<LoyaltyPoint> {
    let loyaltyPoint = await this.loyaltyPointModel
      .findOne({ user: userId })
      .exec();

    if (!loyaltyPoint) {
      loyaltyPoint = new this.loyaltyPointModel({
        user: userId,
        pointsHistory: [],
        currentTotalPoints: 0,
      });
      await loyaltyPoint.save();
    }

    return loyaltyPoint;
  }

  async getUserLoyaltyPoints(userId: string): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.loyaltyPointModel
      .findOne({ user: userId })
      .populate('user', 'name email')
      .exec();

    if (!loyaltyPoint) {
      return this.createOrGetUserLoyaltyPoints(userId);
    }

    return loyaltyPoint;
  }

  async addPoints(addPointsDto: AddPointsDto): Promise<LoyaltyPoint> {
    const { userId, points, type, description, bookingId } = addPointsDto;

    let loyaltyPoint = await this.loyaltyPointModel
      .findOne({ user: userId })
      .exec();

    if (!loyaltyPoint) {
      loyaltyPoint = new this.loyaltyPointModel({
        user: userId,
        pointsHistory: [],
        currentTotalPoints: 0,
      });
    }

    // Add transaction to history
    const transaction = {
      type,
      points: type === 'redeem' ? -points : points,
      description,
      bookingId,
      createdAt: new Date(),
    } as TPointHistory;

    loyaltyPoint.pointsHistory.push(transaction);

    // Update current total points
    if (type === 'redeem') {
      loyaltyPoint.currentTotalPoints = Math.max(
        0,
        loyaltyPoint.currentTotalPoints - points,
      );
    } else {
      loyaltyPoint.currentTotalPoints += points;
    }

    return loyaltyPoint.save();
  }

  async getAllLoyaltyPoints(): Promise<LoyaltyPoint[]> {
    return this.loyaltyPointModel
      .find()
      .populate('user', 'name email')
      .sort({ currentTotalPoints: -1 })
      .exec();
  }

  async getTopUsers(limit: number = 10): Promise<LoyaltyPoint[]> {
    return this.loyaltyPointModel
      .find()
      .populate('user', 'name email')
      .sort({ currentTotalPoints: -1 })
      .limit(limit)
      .exec();
  }

  async getUserPointsHistory(userId: string): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.loyaltyPointModel
      .findOne({ user: userId })
      .populate('user', 'name email')
      .exec();

    if (!loyaltyPoint) {
      throw new NotFoundException('Loyalty points not found for user');
    }

    return loyaltyPoint;
  }

  async redeemPoints(
    userId: string,
    points: number,
    description: string,
  ): Promise<LoyaltyPoint> {
    const loyaltyPoint = await this.loyaltyPointModel
      .findOne({ user: userId })
      .exec();

    if (!loyaltyPoint) {
      throw new NotFoundException('Loyalty points not found for user');
    }

    if (loyaltyPoint.currentTotalPoints < points) {
      throw new Error('Insufficient points');
    }

    return this.addPoints({
      userId,
      points,
      type: 'redeem',
      description,
    });
  }

  async earnPointsFromBooking(
    userId: string,
    bookingAmount: number,
    bookingId: string,
  ): Promise<LoyaltyPoint> {
    // Calculate points based on booking amount (e.g., 1 point per 1000 VND)
    const points = Math.floor(bookingAmount / 1000);

    if (points > 0) {
      return this.addPoints({
        userId,
        points,
        type: 'earn',
        description: `Earned points from booking #${bookingId}`,
        bookingId,
      });
    }

    return this.getUserLoyaltyPoints(userId);
  }
}
