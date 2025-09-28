import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { AdminRoomsController } from './admin-rooms.controller';
import { Room, RoomSchema } from './schemas/room.schema';
import { RoomLayout, RoomLayoutSchema } from './schemas/room-layout.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: RoomLayout.name, schema: RoomLayoutSchema },
    ]),
  ],
  controllers: [RoomsController, AdminRoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
