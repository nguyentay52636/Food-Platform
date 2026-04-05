// src/schemas/poi.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PoiDocument = Poi & Document;

@Schema({ timestamps: true })
export class Poi {
    @Prop({ required: true, unique: true, trim: true })
    tenPOI: string;

    @Prop({ required: true })
    loaiPOI: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'Language',
        required: true
    })
    NgonNguPOI: Types.ObjectId;

    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop()
    rangeTrigger?: number;

    @Prop()
    thumbnail?: string;

    @Prop()
    ngayTao?: Date;
    @Prop([String])
    images?: string[];

    @Prop()
    address?: string;
}

export const PoiSchema = SchemaFactory.createForClass(Poi);

PoiSchema.index({ latitude: 1, longitude: 1 });
PoiSchema.index({ loaiPOI: 1 });