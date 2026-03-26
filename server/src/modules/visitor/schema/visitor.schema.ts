// visitor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitorSessionDocument = VisitorSession & Document;

// ─── Embedded Sub-schemas ───────────────────────────────────────────

@Schema({ _id: false })
export class PageViewEvent {
    @Prop({ required: true })
    page: string; // "home" | "poi_detail" | "tour_detail" | "scan" | "settings"

    @Prop({ type: Object, default: {} })
    params: Record<string, unknown>; // { poiId: "...", filter: "major" }

    @Prop({ default: () => new Date() })
    viewedAt: Date;

    @Prop({ default: 0 })
    durationSeconds: number; // Thời gian ở trang (cập nhật khi rời page)
}

@Schema({ _id: false })
export class POIEvent {
    @Prop({ type: Types.ObjectId, ref: 'POI', required: true })
    poiId: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['view', 'audio_play', 'audio_complete', 'directions', 'share', 'favorite'],
    })
    eventType: string;

    @Prop({ type: String, enum: ['vi', 'en', 'zh', 'ja'], default: null })
    languageCode: string | null;

    @Prop({ default: 0, min: 0, max: 100 })
    audioProgress: number;

    @Prop({ default: 0 })
    durationSeconds: number;

    @Prop({ default: () => new Date() })
    timestamp: Date;
}

@Schema({ _id: false })
export class TourEvent {
    @Prop({ type: Types.ObjectId, ref: 'Tour', required: true })
    tourId: Types.ObjectId;

    @Prop({
        required: true,
        enum: ['view', 'start', 'complete', 'share'],
    })
    eventType: string;

    @Prop({ default: 0, min: 0, max: 100 })
    progressPercent: number; // % tour đã hoàn thành

    @Prop({ default: () => new Date() })
    timestamp: Date;
}

@Schema({ _id: false })
export class QRScanEvent {
    @Prop({ type: Types.ObjectId, ref: 'QRCode', required: true })
    qrCodeId: Types.ObjectId;

    @Prop({ default: () => new Date() })
    scannedAt: Date;
}

// ─── Main Schema ─────────────────────────────────────────────────────

@Schema({ timestamps: true, collection: 'visitor_sessions' })
export class VisitorSession {
    // --- Session Identity ---
    @Prop({ required: true, unique: true, index: true })
    sessionId: string; // UUID từ localStorage phía client

    @Prop({ type: String, default: null })
    deviceId: string | null; // Browser fingerprint (optional)

    // --- Entry Source ---
    @Prop({
        enum: ['direct', 'qr_code', 'share_link'],
        default: 'direct',
        index: true,
    })
    entrySource: string;

    @Prop({ type: String, default: null })
    entryTargetId: string | null; // POI/Tour ID khi vào từ QR hoặc share link

    // --- Device Info ---
    @Prop({ type: String, default: null })
    userAgent: string | null;

    @Prop({
        type: String,
        enum: ['vi', 'en', 'zh', 'ja'],
        default: 'vi',
    })
    language: string; // Ngôn ngữ browser/app khi vào

    @Prop({ type: String, default: null })
    ipAddress: string | null;

    @Prop({ type: String, default: null })
    country: string | null;

    // --- Page Views ---
    @Prop({ type: [PageViewEvent], default: [] })
    pageViews: PageViewEvent[];

    // --- POI Interactions ---
    @Prop({ type: [POIEvent], default: [] })
    poiEvents: POIEvent[];

    // --- Tour Interactions ---
    @Prop({ type: [TourEvent], default: [] })
    tourEvents: TourEvent[];

    // --- QR Scans ---
    @Prop({ type: [QRScanEvent], default: [] })
    qrScans: QRScanEvent[];

    // --- Session Timing ---
    @Prop({ required: true, index: true })
    startedAt: Date;

    @Prop({ type: Date, default: null })
    lastActiveAt: Date | null;

    @Prop({ type: Date, default: null })
    endedAt: Date | null;

    @Prop({ default: 0 })
    totalDurationSeconds: number;

    // createdAt, updatedAt — auto by timestamps: true
}

export const VisitorSessionSchema = SchemaFactory.createForClass(VisitorSession);

// ─── Indexes ─────────────────────────────────────────────────────────

// Compound indexes cho analytics queries
VisitorSessionSchema.index({ 'poiEvents.poiId': 1 });
VisitorSessionSchema.index({ 'tourEvents.tourId': 1 });
VisitorSessionSchema.index({ startedAt: -1 });

// TTL: tự xóa session sau 90 ngày (7,776,000 giây)
VisitorSessionSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 7_776_000 },
);
