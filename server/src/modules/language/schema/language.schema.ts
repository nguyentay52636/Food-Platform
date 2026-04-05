// src/modules/language/schema/language.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema({
  timestamps: true,
  collection: 'Tbl_NgonNgu',
  // Collection has legacy rows using either PascalCase or camelCase keys, and two
  // unique indexes (MaNgonNgu + maNgonNgu). New docs must set both pairs on insert.
  strict: false,
})
export class Language {
  @Prop({
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  MaNgonNgu: string;

  @Prop({ required: true, trim: true })
  TenNgonNgu: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);

LanguageSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const o = ret as unknown as Record<string, unknown>;
    const ma = o.MaNgonNgu ?? o.maNgonNgu;
    const ten = o.TenNgonNgu ?? o.tenNgonNgu;
    delete o.MaNgonNgu;
    delete o.maNgonNgu;
    delete o.TenNgonNgu;
    delete o.tenNgonNgu;
    o.maNgonNgu = ma;
    o.tenNgonNgu = ten;
    return ret;
  },
});