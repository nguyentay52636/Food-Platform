// src/schemas/poi.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PoiDocument = Poi & Document;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Poi {
    @Prop({ required: true, unique: true, trim: true })
    tenPOI: string;

    @Prop({ required: true })
    loaiPOI: string;

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


    @Prop({
        type: Types.ObjectId,
        ref: 'User',
    })
    maOwner: Types.ObjectId;
}

export const PoiSchema = SchemaFactory.createForClass(Poi);

// Liên kết virtual với Review
PoiSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'maPOI',
});

PoiSchema.index({ latitude: 1, longitude: 1 });
PoiSchema.index({ loaiPOI: 1 });