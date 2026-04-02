// poi-language.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type POILanguageDocument = POILanguage & Document;

@Schema({ timestamps: true, collection: 'Tbl_POI_NgonNgu' })
export class POILanguage {

  @Prop({ type: Number, unique: true, sparse: true })
  MaPOI_NgonNgu: number;

  @Prop({ type: Types.ObjectId, ref: 'POI', required: true, index: true })
  MaPOI: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  MaNgonNgu: string;

  @Prop({ required: true, maxlength: 255 })
  TieuDe: string;

  @Prop({ type: String, default: null })
  MoTa: string;
}

export const POINgonNguSchema = SchemaFactory.createForClass(POILanguage);

POINgonNguSchema.index({ MaPOI: 1, MaNgonNgu: 1 }, { unique: true });
