import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// tour.schema.ts
@Schema({ timestamps: true })
export class Tour {
    @Prop({ unique: true })
    slug: string;

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

    @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
    status: string;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ default: 0 })
    displayOrder: number;

    @Prop([
        {
            languageCode: String,
            name: String,
            description: String,
            highlights: [String],
        },
    ])
    translations: any[];

    @Prop([
        {
            poiId: { type: String, ref: 'POI' },
            displayOrder: Number,
            notes: Object,
        },
    ])
    stops: any[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);