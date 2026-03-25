// poi.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type POIDocument = POI & Document;

@Schema({ timestamps: true })
export class POI {
    @Prop({ unique: true })
    slug: string;

    @Prop({ enum: ['major', 'minor'], required: true })
    category: string;

    @Prop({ enum: ['wc', 'ticket', 'parking', 'dock'] })
    subCategory?: string;

    // Location
    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop()
    address?: string;

    // Media
    @Prop([String])
    images: string[];

    @Prop()
    thumbnailUrl?: string;

    // Business
    @Prop()
    phone?: string;

    @Prop()
    website?: string;

    @Prop({ enum: ['$', '$$', '$$$', '$$$$'] })
    priceRange?: string;

    @Prop({ type: Object })
    openingHours?: Record<string, string>;

    // Rating
    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: 0 })
    reviewCount: number;

    // Status
    @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
    status: string;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ default: 0 })
    displayOrder: number;

    // Relations
    @Prop()
    createdBy?: string;

    @Prop([
        {
            languageCode: { type: String, enum: ['vi', 'en', 'zh', 'ja'] },
            name: String,
            description: String,
            shortDescription: String,
        },
    ])
    translations: any[];

    // 🔥 Embed audios
    @Prop([
        {
            languageCode: String,
            audioUrl: String,
            durationSeconds: Number,
            format: String,
            status: {
                type: String,
                enum: ['active', 'processing', 'error'],
                default: 'active',
            },
        },
    ])
    audios: any[];
}

export const POISchema = SchemaFactory.createForClass(POI);