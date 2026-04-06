import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import {
  PoiTranslation,
  PoiTranslationDocument,
} from './schema/poi-translation.schema';
import { CreatePoiTranslationDto } from './dto/create-poi-translation.dto';
import { UpdatePoiTranslationDto } from './dto/update-poi-translation.dto';

const populatePaths = [
  { path: 'maPOI', select: 'tenPOI loaiPOI' },
  {
    path: 'maNgonNgu',
    select: 'MaNgonNgu TenNgonNgu maNgonNgu tenNgonNgu',
  },
] as const;

@Injectable()
export class PoiTranslationService {
  constructor(
    @InjectModel(PoiTranslation.name)
    private readonly poiTranslationModel: Model<PoiTranslationDocument>,
  ) {}

  async create(dto: CreatePoiTranslationDto): Promise<PoiTranslationDocument> {
    if (!Types.ObjectId.isValid(dto.maPOI) || !Types.ObjectId.isValid(dto.maNgonNgu)) {
      throw new BadRequestException('maPOI hoặc maNgonNgu không hợp lệ');
    }
    const maPOI = new Types.ObjectId(dto.maPOI);
    const maNgonNgu = new Types.ObjectId(dto.maNgonNgu);

    const dup = await this.poiTranslationModel
      .findOne({
        $or: [
          { maPOI, maNgonNgu },
          { MaPOI: maPOI, MaNgonNgu: maNgonNgu },
        ],
      })
      .lean()
      .exec();
    if (dup) {
      throw new ConflictException(
        'Đã có bản dịch cho POI này với ngôn ngữ đã chọn',
      );
    }

    try {
      const doc = new this.poiTranslationModel({
        maPOI,
        maNgonNgu,
        MaPOI: maPOI,
        MaNgonNgu: maNgonNgu,
        tieuDe: dto.tieuDe.trim(),
        moTa: dto.moTa?.trim(),
        audioUrl: dto.audioUrl?.trim(),
        audioDurationSec: dto.audioDurationSec,
        audioUpdatedAt: dto.audioUrl ? new Date() : undefined,
      });
      return await doc.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException(
          'Đã có bản dịch cho POI này với ngôn ngữ đã chọn',
        );
      }
      throw err;
    }
  }

  async findAll(maPOI?: string): Promise<PoiTranslationDocument[]> {
    const filter: Record<string, unknown> = {};
    if (maPOI !== undefined && maPOI !== '') {
      if (!Types.ObjectId.isValid(maPOI)) {
        throw new BadRequestException('maPOI không hợp lệ');
      }
      filter.maPOI = new Types.ObjectId(maPOI);
    }

    return this.poiTranslationModel
      .find(filter)
      .populate([...populatePaths])
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PoiTranslationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const doc = await this.poiTranslationModel
      .findById(id)
      .populate([...populatePaths])
      .exec();
    if (!doc) {
      throw new NotFoundException('Không tìm thấy bản dịch POI');
    }
    return doc;
  }

  async update(
    id: string,
    dto: UpdatePoiTranslationDto,
  ): Promise<PoiTranslationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    const existing = await this.poiTranslationModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Không tìm thấy bản dịch POI');
    }

    let nextMaNgonNgu = existing.maNgonNgu as Types.ObjectId;
    if (dto.maNgonNgu !== undefined) {
      if (!Types.ObjectId.isValid(dto.maNgonNgu)) {
        throw new BadRequestException('maNgonNgu không hợp lệ');
      }
      nextMaNgonNgu = new Types.ObjectId(dto.maNgonNgu);
    }

    if (
      dto.maNgonNgu &&
      !nextMaNgonNgu.equals(existing.maNgonNgu as Types.ObjectId)
    ) {
      const clash = await this.poiTranslationModel
        .findOne({
          _id: { $ne: existing._id },
          maPOI: existing.maPOI,
          maNgonNgu: nextMaNgonNgu,
        })
        .lean()
        .exec();
      if (clash) {
        throw new ConflictException(
          'Đã có bản dịch khác cùng POI và ngôn ngữ này',
        );
      }
    }

    if (dto.tieuDe !== undefined) {
      existing.tieuDe = dto.tieuDe.trim();
    }
    if (dto.moTa !== undefined) {
      existing.moTa = dto.moTa.trim();
    }
    if (dto.audioUrl !== undefined) {
      existing.audioUrl = dto.audioUrl.trim();
      existing.audioUpdatedAt = new Date();
    }
    if (dto.audioDurationSec !== undefined) {
      existing.audioDurationSec = dto.audioDurationSec;
    }
    if (dto.maNgonNgu) {
      existing.maNgonNgu = nextMaNgonNgu;
      (existing as unknown as Record<string, unknown>).MaNgonNgu = nextMaNgonNgu;
    }

    try {
      await existing.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException(
          'Đã có bản dịch cho POI này với ngôn ngữ đã chọn',
        );
      }
      throw err;
    }

    const refreshed = await this.poiTranslationModel
      .findById(existing._id)
      .populate([...populatePaths])
      .exec();
    if (!refreshed) {
      throw new NotFoundException('Không tìm thấy bản dịch POI');
    }
    return refreshed;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const res = await this.poiTranslationModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('Không tìm thấy bản dịch POI');
    }
  }

  async findByPoiAndLanguage(
    maPOI: string,
    maNgonNgu: string,
  ): Promise<PoiTranslationDocument | null> {
    if (!Types.ObjectId.isValid(maPOI) || !Types.ObjectId.isValid(maNgonNgu)) {
      throw new BadRequestException('maPOI hoặc maNgonNgu không hợp lệ');
    }
    return this.poiTranslationModel
      .findOne({
        $or: [
          {
            maPOI: new Types.ObjectId(maPOI),
            maNgonNgu: new Types.ObjectId(maNgonNgu),
          },
          {
            MaPOI: new Types.ObjectId(maPOI),
            MaNgonNgu: new Types.ObjectId(maNgonNgu),
          },
        ],
      })
      .populate([...populatePaths])
      .exec();
  }
}
