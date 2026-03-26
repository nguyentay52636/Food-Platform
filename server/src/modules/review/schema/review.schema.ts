// review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'POI', required: true, index: true })
  poiId: Types.ObjectId;

  @Prop({
    enum: ['user', 'anonymous'],
    default: 'anonymous',
  })
  authorType: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null; // null nếu là anonymous review

  @Prop({ default: 'Khách du lịch', trim: true })
  authorName: string; // Tên hiển thị (bất kể anonymous hay có tài khoản)

  @Prop({ default: null, index: true })
  sessionId: string | null; // Visitor session ID (nếu là anonymous)

  // --- Review Content ---
  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // 1–5 sao

  @Prop({ default: null, maxlength: 2000 })
  comment: string | null;

  @Prop({
    enum: ['vi', 'en', 'zh', 'ja'],
    default: 'vi',
  })
  language: string; // Ngôn ngữ viết review

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved', // auto-approve, dùng 'pending' nếu cần kiểm duyệt
    index: true,
  })
  status: string;

  @Prop({ default: null })
  rejectionReason: string | null; // Lý do từ chối (nếu status = rejected)

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  moderatedBy: Types.ObjectId | null; // Admin/Staff đã duyệt/từ chối

  @Prop({ default: null })
  moderatedAt: Date | null;

  // createdAt, updatedAt — auto by timestamps: true
}

export const ReviewSchema = SchemaFactory.createForClass(Review);


ReviewSchema.index({ poiId: 1, status: 1 });
ReviewSchema.index({ poiId: 1, rating: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ createdAt: -1 });
