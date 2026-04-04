// poi.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type POIDocument = POI & Document;

@Schema({ timestamps: true, collection: 'Tbl_POI' })
export class POI {
  @Prop({ type: Number, unique: true, sparse: true })
  MaPOI: number;

  @Prop({ required: true })
  TenPOI: string;

  @Prop({ required: true })
  LoaiPOI: string;

  @Prop({ required: true, type: Number })
  Latitude: number;

  @Prop({ required: true, type: Number })
  Longitude: number;

  @Prop({ type: Number, default: 0 })
  RangeTrigger: number;

  @Prop()
  Thumbnail: string;

  @Prop({ type: Date, default: Date.now })
  NgayTao: Date;

  // Track who created this POI
  @Prop()
  createdBy?: string;

  // For Many-to-Many relationship with Category in Mongo
  @Prop({ type: [Number], default: [] })
  MaCategory: number[];
}

export const POISchema = SchemaFactory.createForClass(POI);

POISchema.index({ Latitude: 1, Longitude: 1 });
POISchema.index({ TenPOI: 'text' });