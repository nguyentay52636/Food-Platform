// review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: String, unique: true, sparse: true })
  reviewId: string; // MaReview

  @Prop({ type: Types.ObjectId, ref: 'POI', required: true, index: true })
  PoiId: Types.ObjectId; // MaPoi

  @Prop({ type: String, default: null })
  devideId: string | null; // DeviceId

  @Prop({ type: String, default: null })
  ipAddress: string | null;

  @Prop({ type: String, default: 'Khách du lịch', trim: true })
  username: string; // username / MaKH

  @Prop({ type: String, default: null, trim: true })
  email: string | null;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, required: true, maxlength: 2000 })
  content: string; // content / NoiDung

  @Prop({ type: Date, default: Date.now })
  time: Date; // time / ThoiGian

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isFlagged: boolean;

  // --- Extended fields for App Logic ---
  @Prop({
    type: String,
    enum: ['user', 'anonymous'],
    default: 'anonymous',
  })
  authorType: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ type: String, default: null, index: true })
  sessionId: string | null;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: String,
    enum: ['vi', 'en', 'zh', 'ja'],
    default: 'vi',
  })
  language: string;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
    index: true,
  })
  status: string;

  @Prop({ type: String, default: null })
  rejectionReason: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  moderatedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  moderatedAt: Date | null;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ PoiId: 1, status: 1 });
ReviewSchema.index({ PoiId: 1, rating: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ time: -1 });
