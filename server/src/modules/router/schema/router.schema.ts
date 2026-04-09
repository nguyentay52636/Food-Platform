import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RouterDocument = Router & Document;

@Schema({
    timestamps: true,
    collection: 'Tbl_Router',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Router {
    @Prop({ required: true, trim: true })
    tenRouter: string;

    @Prop({ trim: true })
    moTa?: string;

    @Prop()
    thoiGianDuKien?: string;

    @Prop()
    thumbnail?: string;

}

export const RouterSchema = SchemaFactory.createForClass(Router);

// Virtual to get POIs in this router through RouterPoi
RouterSchema.virtual('pois', {
    ref: 'RouterPoi',
    localField: '_id',
    foreignField: 'maRouter',
    options: { sort: { thuTu: 1 } }
});
