import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { File, FileDocument } from '../files/schemas/file.schema';
import { BannerStatus } from 'src/enums/banner-status.enum';
import { ReorderBannersDto } from './dto/reorder-banners.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async create(dto: CreateBannerDto): Promise<Banner> {
    const imageObjectId = new Types.ObjectId(dto.imageId);

    await this.fileModel.findByIdAndUpdate(imageObjectId, { isActive: true });

    const banner = new this.bannerModel({
      title: dto.title,
      description: dto.description,
      imageId: imageObjectId,
      linkUrl: dto.linkUrl,
      status: dto.status ?? BannerStatus.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
    });
    return banner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().sort({ sortOrder: 1, createdAt: -1 }).exec();
  }

  async findActive(): Promise<Banner[]> {
    return this.bannerModel
      .find({ status: BannerStatus.ACTIVE })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async update(id: string, dto: UpdateBannerDto): Promise<Banner> {
    const existing = await this.bannerModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Banner not found');

    let oldImageId: Types.ObjectId | null = null;
    // Only handle file activation/deletion when imageId actually changes
    if (dto.imageId && String(existing.imageId) !== dto.imageId) {
      oldImageId = existing.imageId as unknown as Types.ObjectId;
      const newImageId = new Types.ObjectId(dto.imageId);
      // Activate new image
      await this.fileModel.findByIdAndUpdate(newImageId, { isActive: true });
      // Update banner with new image id
      await this.bannerModel.updateOne(
        { _id: id },
        { $set: { imageId: newImageId } },
      );
      // Delete old image
      if (oldImageId) {
        await this.fileModel.findByIdAndDelete(oldImageId);
      }
    }

    // update other fields
    await this.bannerModel.updateOne(
      { _id: id },
      {
        $set: {
          title: dto.title ?? existing.title,
          description: dto.description ?? existing.description,
          linkUrl: dto.linkUrl ?? existing.linkUrl,
          status: dto.status ?? existing.status,
          sortOrder:
            typeof dto.sortOrder === 'number'
              ? dto.sortOrder
              : existing.sortOrder,
        },
      },
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.bannerModel.findById(id).exec();
    if (!existing) throw new NotFoundException('Banner not found');

    const imageId = existing.imageId as unknown as Types.ObjectId;

    await this.bannerModel.findByIdAndDelete(id).exec();
    if (imageId) {
      await this.fileModel.findByIdAndDelete(imageId);
    }
  }

  async reorder(dto: ReorderBannersDto): Promise<void> {
    const bulkOps = dto.ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { sortOrder: index } },
      },
    }));
    if (bulkOps.length === 0) return;
    await this.bannerModel.bulkWrite(bulkOps);
  }
}
