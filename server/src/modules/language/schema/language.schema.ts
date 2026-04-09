// src/modules/language/schema/language.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema({
  timestamps: true,
  collection: 'Tbl_NgonNgu',
})
export class Language {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  nativeName: string;

  @Prop({ required: true, trim: true })
  flag: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);