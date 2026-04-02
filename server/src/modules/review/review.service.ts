// review.service.ts
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
    userId?: string,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.create({
      PoiId: new Types.ObjectId(dto.PoiId),
      rating: dto.rating,
      content: dto.content,
      language: dto.language || 'vi',
      username: dto.username || 'Khách du lịch',
      email: dto.email || null,
      devideId: dto.devideId || null,
      sessionId: dto.sessionId || null,
      images: dto.images || [],
      authorType: userId ? 'user' : 'anonymous',
      userId: userId ? new Types.ObjectId(userId) : null,
      status: 'approved',
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
      PoiId: new Types.ObjectId(poiId),
      status: 'approved',
    };

    const [data, total, ratingAgg] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.reviewModel.countDocuments(filter),
      this.reviewModel.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
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
    status?: string,
  ): Promise<{ data: ReviewDocument[]; total: number }> {
    const filter = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('PoiId', 'translations')
        .populate('userId', 'username email')
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
    moderatorId: string,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: dto.status,
          rejectionReason: dto.rejectionReason ?? null,
          moderatedBy: new Types.ObjectId(moderatorId),
          moderatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!review) throw new NotFoundException('Review không tìm thấy');
    return review;
  }

  // ── Delete review (Admin) ───────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Review không tìm thấy');
  }

  // ── Rating summary for a POI (dùng để sync lên POI document) ───────
  async getRatingSummary(
    poiId: string,
  ): Promise<{ avgRating: number; reviewCount: number }> {
    const result = await this.reviewModel.aggregate([
      {
        $match: {
          PoiId: new Types.ObjectId(poiId),
          status: 'approved',
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
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
