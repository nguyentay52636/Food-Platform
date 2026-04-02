// language.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema({ timestamps: true, collection: 'Tbl_NgonNgu' })
export class Language {
  @Prop({ unique: true, required: true })
  MaNgonNgu: string; // e.g., 'vi', 'en', 'fr'

  @Prop({ required: true })
  TenNgonNgu: string; // e.g., 'Tiếng Việt', 'English'
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
