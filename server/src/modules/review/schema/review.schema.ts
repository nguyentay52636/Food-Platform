// review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'Tbl_Review' })
export class Review {
  @Prop({ type: Number, unique: true, sparse: true })
  MaReview: number;

  @Prop({ type: Types.ObjectId, ref: 'POI', required: true, index: true })
  MaPOI: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  MaSession: string;

  @Prop({ type: String, default: null })
  DeviceId: string | null;

  @Prop({ type: String, default: null })
  IpAddress: string | null;

  @Prop({ type: String, default: 'Khách du lịch', trim: true })
  TenNguoiDung: string;

  @Prop({ type: String, default: null, trim: true })
  Email: string | null;

  @Prop({ required: true, min: 1, max: 5 })
  SoSao: number;

  @Prop({ type: String, required: true, maxlength: 2000 })
  NoiDung: string;

  @Prop({ type: Date, default: Date.now })
  ThoiGian: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isFlagged: boolean;

  // --- Extended fields for App Logic (Optional, but kept for compatibility) ---
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ MaPOI: 1, MaSession: 1 }, { unique: true });
ReviewSchema.index({ ThoiGian: -1 });

