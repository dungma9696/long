import { PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @IsOptional()
  @IsMongoId()
  imageId?: string;
}
