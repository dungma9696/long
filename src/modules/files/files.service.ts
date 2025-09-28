import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(fileData: {
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    path: string;
    description?: string;
    uploadedBy?: string;
  }): Promise<File> {
    const createdFile = new this.fileModel(fileData);
    return createdFile.save();
  }

  async findById(id: string): Promise<File> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.find({ isActive: true }).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.fileModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!result) {
      throw new NotFoundException('File not found');
    }
  }

  async getFileStream(id: string): Promise<{ stream: Readable; file: File }> {
    const file = await this.findById(id);

    const filePath = join(process.cwd(), 'uploads', file.filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    const stream = createReadStream(filePath);
    return { stream, file };
  }
}
