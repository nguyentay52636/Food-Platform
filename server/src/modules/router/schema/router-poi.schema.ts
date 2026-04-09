import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Router } from './router.schema';
import { Poi } from '../../poi/schema/poi.schema';

export type RouterPoiDocument = RouterPoi & Document;

@Schema({
    timestamps: true,
    collection: 'Tbl_RouterPoi'
})
export class RouterPoi {
    @Prop({
        type: Types.ObjectId,
        ref: 'Router',
        required: true
    })
    maRouter: Types.ObjectId | Router;

    @Prop({
        type: Types.ObjectId,
        ref: 'Poi',
        required: true
    })
    maPoi: Types.ObjectId | Poi;

    @Prop({ required: true, default: 0 })
    thuTu: number;
}

export const RouterPoiSchema = SchemaFactory.createForClass(RouterPoi);

// Index to ensure unique POI per router or just for performance
RouterPoiSchema.index({ maRouter: 1, thuTu: 1 });
RouterPoiSchema.index({ maRouter: 1, maPoi: 1 }, { unique: true });
