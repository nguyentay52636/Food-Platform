import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Session } from '../../session/schema/session.schema';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
  collection: 'Tbl_Review'
})
export class Review {
  @Prop({
    type: Types.ObjectId,
    ref: 'Poi',
    required: true
  })
  maPOI: Types.ObjectId;

  @Prop({
    type: String,
    ref: 'Session',
    required: true
  })
  maSession: Session;

  @Prop({ type: String, sparse: true })
  deviceId?: string | null;

  @Prop({ type: String, sparse: true })
  ipAddress?: string | null;

  @Prop({ trim: true })
  tenNguoiDung?: string;

  @Prop({ type: String, lowercase: true, trim: true })
  email?: string | null;

  @Prop({
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: (value: number) => Number.isInteger(value),
      message: 'SoSao phải là số nguyên từ 1 đến 5'
    }
  })
  soSao: number;

  @Prop({ trim: true, maxlength: 1000 })
  noiDung?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isFlagged: boolean;

  @Prop()
  thoiGian?: Date;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);


ReviewSchema.index({ maPOI: 1, maSession: 1 }, { unique: true });

ReviewSchema.index({ maPOI: 1, soSao: 1 });
ReviewSchema.index({ maPOI: 1, createdAt: -1 });
ReviewSchema.index({ isDeleted: 1, isFlagged: 1 });
ReviewSchema.index({ maSession: 1 });
ReviewSchema.index({ isFlagged: 1, createdAt: -1 });