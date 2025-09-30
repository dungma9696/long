import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '../../../enums/room-status.enum';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Room layout ID' })
  @IsMongoId()
  roomLayout: string;

  @ApiProperty({ description: 'Room format (2D, 3D, IMAX)', required: false })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty({
    description: 'Room status',
    enum: RoomStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
