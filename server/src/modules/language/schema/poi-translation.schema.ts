// src/modules/language/schema/poi-translation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PoiTranslationDocument = PoiTranslation & Document;

@Schema({
  timestamps: true,
  collection: 'Tbl_POI_NgonNgu',
  // Legacy collection has mixed PascalCase/camelCase keys and indexes.
  strict: false,
})
export class PoiTranslation {
  @Prop({ type: Types.ObjectId, ref: 'Poi', required: true })
  maPOI: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Language',
    required: true
  })
  maNgonNgu: Types.ObjectId;

  @Prop({ required: true })
  tieuDe: string;

  @Prop()
  moTa?: string;

  @Prop()
  audioUrl?: string;

  @Prop()
  audioDurationSec?: number;

  @Prop()
  audioUpdatedAt?: Date;
}

export const PoiTranslationSchema = SchemaFactory.createForClass(PoiTranslation);

PoiTranslationSchema.index({ maPOI: 1, maNgonNgu: 1 }, { unique: true });