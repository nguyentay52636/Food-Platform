import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tour, TourDocument } from './schema/tour.schema';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  // ─── CREATE ────────────────────────────────────────────────────────────────

  async create(dto: CreateTourDto): Promise<TourDocument> {
    const existing = await this.tourModel.findOne({ slug: dto.slug }).exec();
    if (existing) {
      throw new ConflictException(`Tour với slug "${dto.slug}" đã tồn tại.`);
    }
    const tour = new this.tourModel(dto);
    return tour.save();
  }

  // ─── READ ALL ──────────────────────────────────────────────────────────────

  async findAll(status?: string): Promise<TourDocument[]> {
    const filter = status ? { status } : {};
    return this.tourModel
      .find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .exec();
  }

  // ─── READ ONE BY ID ────────────────────────────────────────────────────────

  async findById(id: string): Promise<TourDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Tour ID "${id}" không hợp lệ.`);
    }
    const tour = await this.tourModel.findById(id).exec();
    if (!tour) throw new NotFoundException(`Không tìm thấy Tour với ID: ${id}`);
    return tour;
  }

  // ─── READ ONE BY SLUG ──────────────────────────────────────────────────────

  async findBySlug(slug: string): Promise<TourDocument> {
    const tour = await this.tourModel.findOne({ slug }).exec();
    if (!tour) throw new NotFoundException(`Không tìm thấy Tour với slug: ${slug}`);
    return tour;
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateTourDto): Promise<TourDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Tour ID "${id}" không hợp lệ.`);
    }

    // Nếu đổi slug, kiểm tra trùng
    if (dto.slug) {
      const conflict = await this.tourModel
        .findOne({ slug: dto.slug, _id: { $ne: id } })
        .exec();
      if (conflict) {
        throw new ConflictException(`Slug "${dto.slug}" đã được dùng bởi Tour khác.`);
      }
    }

    const updated = await this.tourModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .exec();

    if (!updated) throw new NotFoundException(`Không tìm thấy Tour với ID: ${id}`);
    return updated;
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Tour ID "${id}" không hợp lệ.`);
    }
    const result = await this.tourModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Không tìm thấy Tour với ID: ${id}`);
  }

  // ─── INCREMENT VIEW COUNT ──────────────────────────────────────────────────

  async incrementViewCount(id: string): Promise<void> {
    await this.tourModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
}
