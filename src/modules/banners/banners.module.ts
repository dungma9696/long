import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminBannersController } from './admin-banners.controller';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { File, FileSchema } from '../files/schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [AdminBannersController, BannersController],
  providers: [BannersService],
})
export class BannersModule {}
