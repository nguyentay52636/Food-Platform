import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TourDocument = Tour & Document;


@Schema({ _id: false })
class TourTranslation {
    @Prop({ required: true, enum: ['vi', 'en', 'zh', 'ja'] })
    languageCode: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop([String])
    highlights: string[];
}

@Schema({ _id: false })
class TourStop {
    @Prop({ type: Types.ObjectId, ref: 'POI', required: true })
    poiId: Types.ObjectId;

    @Prop({ required: true })
    displayOrder: number;

    @Prop({ type: Map, of: String, default: {} })
    notes: Map<string, string>;
}

@Schema({ timestamps: true })
export class Tour {
    @Prop({ unique: true, index: true })
    slug: string; // URL-friendly, e.g. "diem-den-noi-bat-da-nang"

    @Prop()
    coverImage?: string;

    @Prop([String])
    images: string[];

    @Prop()
    estimatedDurationMinutes?: number;

    @Prop()
    distanceMeters?: number;

    @Prop({ enum: ['easy', 'moderate', 'hard'] })
    difficulty?: string;

    @Prop({ type: [TourTranslation], default: [] })
    translations: TourTranslation[];

    @Prop({ type: [TourStop], default: [] })
    stops: TourStop[];

    @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft', index: true })
    status: string;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ default: 0 })
    displayOrder: number;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    createdBy: Types.ObjectId | null;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    updatedBy: Types.ObjectId | null;

    @Prop({ default: 0 })
    viewCount: number;

    @Prop({ default: 0 })
    startCount: number;

    @Prop({ default: 0 })
    completionCount: number;

    @Prop({ default: 0 })
    qrScanCount: number;

}

export const TourSchema = SchemaFactory.createForClass(Tour);


TourSchema.index({ status: 1, displayOrder: 1 });
TourSchema.index({ isFeatured: 1, status: 1 });
TourSchema.index({ 'stops.poiId': 1 }); 