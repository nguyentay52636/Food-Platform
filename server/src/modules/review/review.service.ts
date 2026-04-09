// src/modules/review/review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  // ── Create review ───────────────────────────────────────────────────
  async create(
    dto: CreateReviewDto,
    ipAddress?: string,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.create({
      maPOI: new Types.ObjectId(dto.maPOI),
      maSession: dto.maSession as any,
      deviceId: dto.deviceId,
      ipAddress: ipAddress || dto.ipAddress,
      tenNguoiDung: dto.tenNguoiDung || 'Khách du lịch',
      email: dto.email,
      soSao: dto.soSao,
      noiDung: dto.noiDung,
      thoiGian: new Date(),
      isDeleted: false,
      isFlagged: false,
    });

    return review;
  }

  // ── Get reviews for a POI ───────────────────────────────────────────
  async findByPOI(
    poiId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: ReviewDocument[]; total: number; avgRating: number }> {
    const filter = {
      maPOI: new Types.ObjectId(poiId),
      isDeleted: false,
    };

    const [data, total, ratingAgg] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('maSession')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.reviewModel.countDocuments(filter),
      this.reviewModel.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$soSao' } } },
      ]),
    ]);

    return {
      data: data as ReviewDocument[],
      total,
      avgRating: ratingAgg[0]?.avg ?? 0,
    };
  }

  // ── Get all reviews (Admin) ─────────────────────────────────────────
  async findAll(
    page = 1,
    limit = 20,
    query?: any,
  ): Promise<{ data: ReviewDocument[]; total: number }> {
    const filter = { isDeleted: false, ...query };
    const [data, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('maPOI', 'tenPOI loaiPOI')
        .populate('maSession')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.reviewModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  // ── Update review status (Admin moderation) ─────────────────────────
  async updateStatus(
    id: string,
    dto: UpdateReviewStatusDto,
  ): Promise<ReviewDocument> {
    const updateData: any = {};
    if (dto.isFlagged !== undefined) updateData.isFlagged = dto.isFlagged;
    if (dto.isDeleted !== undefined) updateData.isDeleted = dto.isDeleted;

    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!review) throw new NotFoundException('Review không tìm thấy');
    return review;
  }

  // ── Delete review (Soft delete) ────────────────────────────────────
  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndUpdate(id, {
      $set: { isDeleted: true },
    });
    if (!result) throw new NotFoundException('Review không tìm thấy');
  }

  // ── Rating summary for a POI (dùng để sync lên POI document) ───────
  async getRatingSummary(
    poiId: string,
  ): Promise<{ avgRating: number; reviewCount: number }> {
    const result = await this.reviewModel.aggregate([
      {
        $match: {
          maPOI: new Types.ObjectId(poiId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$soSao' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    return {
      avgRating: Math.round((result[0]?.avgRating ?? 0) * 10) / 10,
      reviewCount: result[0]?.reviewCount ?? 0,
    };
  }
}
