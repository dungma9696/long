import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { RoomLayout, RoomLayoutDocument } from './schemas/room-layout.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomLayoutDto } from './dto/create-room-layout.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomLayout.name)
    private roomLayoutModel: Model<RoomLayoutDocument>,
  ) {}

  // Room Layout methods
  async createRoomLayout(
    createRoomLayoutDto: CreateRoomLayoutDto,
  ): Promise<RoomLayout> {
    const createdRoomLayout = new this.roomLayoutModel(createRoomLayoutDto);
    return createdRoomLayout.save();
  }

  async findAllRoomLayouts(): Promise<RoomLayout[]> {
    return this.roomLayoutModel.find().exec();
  }

  async findOneRoomLayout(id: string): Promise<RoomLayout> {
    const roomLayout = await this.roomLayoutModel.findById(id).exec();
    if (!roomLayout) {
      throw new NotFoundException('Room layout not found');
    }
    return roomLayout;
  }

  async updateRoomLayout(
    id: string,
    updateRoomLayoutDto: Partial<CreateRoomLayoutDto>,
  ): Promise<RoomLayout> {
    const updatedRoomLayout = await this.roomLayoutModel
      .findByIdAndUpdate(id, updateRoomLayoutDto, { new: true })
      .exec();
    if (!updatedRoomLayout) {
      throw new NotFoundException('Room layout not found');
    }
    return updatedRoomLayout;
  }

  async removeRoomLayout(id: string): Promise<void> {
    const result = await this.roomLayoutModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Room layout not found');
    }
  }

  // Room methods
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().populate('roomLayout').exec();
  }

  async findActive(): Promise<Room[]> {
    return this.roomModel
      .find({ status: 'active' })
      .populate('roomLayout')
      .exec();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel
      .findById(id)
      .populate('roomLayout')
      .exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .populate('roomLayout')
      .exec();
    if (!updatedRoom) {
      throw new NotFoundException('Room not found');
    }
    return updatedRoom;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Room not found');
    }
  }
}
