import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BannerStatus } from 'src/enums/banner-status.enum';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsMongoId()
  imageId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({
    required: false,
    enum: BannerStatus,
    default: BannerStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(BannerStatus)
  status?: BannerStatus;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
