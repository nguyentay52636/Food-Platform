// visitor.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VisitorSession, VisitorSessionDocument } from './schema/visitor.schema';
import {
  CreateVisitorSessionDto,
  TrackPageViewDto,
  TrackPOIEventDto,
  TrackTourEventDto,
  TrackQRScanDto,
  EndSessionDto,
} from './dto/visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectModel(VisitorSession.name)
    private sessionModel: Model<VisitorSessionDocument>,
  ) { }

  async createOrResumeSession(
    dto: CreateVisitorSessionDto,
    req: { ip?: string; headers?: Record<string, string> },
  ): Promise<VisitorSessionDocument> {
    const existing = await this.sessionModel.findOne({ sessionId: dto.sessionId });
    if (existing) {
      existing.lastActiveAt = new Date();
      return existing.save();
    }

    return this.sessionModel.create({
      sessionId: dto.sessionId,
      entrySource: dto.entrySource ?? 'direct',
      entryTargetId: dto.entryTargetId ?? null,
      language: dto.language ?? 'vi',
      userAgent: req.headers?.['user-agent'] ?? null,
      ipAddress: req.ip ?? null,
      startedAt: new Date(),
      lastActiveAt: new Date(),
    });
  }

  async trackPageView(dto: TrackPageViewDto): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId: dto.sessionId },
      {
        $push: {
          pageViews: {
            page: dto.page,
            params: dto.params ?? {},
            viewedAt: new Date(),
            durationSeconds: 0,
          },
        },
        $set: { lastActiveAt: new Date() },
      },
    );
  }

  async trackPOIEvent(dto: TrackPOIEventDto): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId: dto.sessionId },
      {
        $push: {
          poiEvents: {
            poiId: new Types.ObjectId(dto.poiId),
            eventType: dto.eventType,
            languageCode: dto.languageCode ?? null,
            audioProgress: dto.audioProgress ?? 0,
            durationSeconds: dto.durationSeconds ?? 0,
            timestamp: new Date(),
          },
        },
        $set: { lastActiveAt: new Date() },
      },
    );
  }

  // ── Track Tour event ────────────────────────────────────────────────
  async trackTourEvent(dto: TrackTourEventDto): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId: dto.sessionId },
      {
        $push: {
          tourEvents: {
            tourId: new Types.ObjectId(dto.tourId),
            eventType: dto.eventType,
            progressPercent: dto.progressPercent ?? 0,
            timestamp: new Date(),
          },
        },
        $set: { lastActiveAt: new Date() },
      },
    );
  }

  async trackQRScan(dto: TrackQRScanDto): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId: dto.sessionId },
      {
        $push: {
          qrScans: {
            qrCodeId: new Types.ObjectId(dto.qrCodeId),
            scannedAt: new Date(),
          },
        },
        $set: { lastActiveAt: new Date() },
      },
    );
  }

  async endSession(dto: EndSessionDto): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId: dto.sessionId },
      {
        $set: {
          endedAt: new Date(),
          lastActiveAt: new Date(),
          totalDurationSeconds: dto.totalDurationSeconds ?? 0,
        },
      },
    );
  }


  async getPOIViewCount(poiId: string): Promise<number> {
    const result = await this.sessionModel.aggregate([
      { $unwind: '$poiEvents' },
      {
        $match: {
          'poiEvents.poiId': new Types.ObjectId(poiId),
          'poiEvents.eventType': 'view',
        },
      },
      { $count: 'total' },
    ]);
    return result[0]?.total ?? 0;
  }

  /** Tổng số sessions trong khoảng thời gian */
  async getSessionStats(from: Date, to: Date) {
    return this.sessionModel.aggregate([
      { $match: { startedAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          avgDuration: { $avg: '$totalDurationSeconds' },
          fromQR: {
            $sum: { $cond: [{ $eq: ['$entrySource', 'qr_code'] }, 1, 0] },
          },
        },
      },
    ]);
  }
}
