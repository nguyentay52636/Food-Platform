// qrcode.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QRCodeDocument = QRCode & Document;

@Schema({ timestamps: true })
export class QRCode {

    @Prop({ required: true, unique: true, index: true })
    code: string;

    @Prop({
        required: true,
        enum: ['poi', 'tour', 'home'],
        index: true
    })
    targetType: string;

    @Prop({ type: String, ref: 'POI', index: true })
    targetPoiId?: string;

    @Prop({ type: String, ref: 'Tour', index: true })
    targetTourId?: string;

    @Prop()
    locationDescription?: string;

    @Prop({ default: 0 })
    scanCount: number;

    @Prop({
        enum: ['active', 'inactive'],
        default: 'active',
        index: true
    })
    status: string;

    // 👤 Admin tạo
    @Prop({ type: String, ref: 'AdminUser' })
    createdBy?: string;
}

export const QRCodeSchema = SchemaFactory.createForClass(QRCode);