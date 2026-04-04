// poi.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { POI, POIDocument } from './schema/poi.schema';
import { POILanguage, POILanguageDocument } from '../language/schema/poi-language.schema';
import { CreatePoiDto, UpdatePoiDto } from './dto/poi.dto';

@Injectable()
export class PoiService {
  constructor(
    @InjectModel(POI.name) private poiModel: Model<POIDocument>,
    @InjectModel(POILanguage.name) private poiLangModel: Model<POILanguageDocument>,
  ) {}

  // ── Create POI ──────────────────────────────────────────────────────
  async create(dto: CreatePoiDto): Promise<POIDocument> {
    const { translations, ...poiData } = dto;

    // 1. Save main POI document
    const poi = await this.poiModel.create(poiData);

    // 2. Save translations in separate collection
    if (translations && translations.length > 0) {
      const langEntries = translations.map((t) => ({
        MaPOI_NgonNgu: t.MaPOI_NgonNgu,
        MaPOI: poi._id, // Linking via ObjectId
        MaNgonNgu: t.MaNgonNgu,
        TieuDe: t.TieuDe,
        MoTa: t.MoTa,
        Audios: t.Audios || [],
      }));
      await this.poiLangModel.insertMany(langEntries);
    }

    return poi;
  }

  // ── Find All POIs ──────────────────────────────────────────────────
  async findAll(page = 1, limit = 10, langCode = 'vi') {
    const skip = (page - 1) * limit;

    const pois = await this.poiModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await this.poiModel.countDocuments();

    // Map translations to each POI for the specified language
    const poiIds = pois.map(p => p._id);
    const trans = await this.poiLangModel.find({
      MaPOI: { $in: poiIds },
      MaNgonNgu: langCode,
    }).lean();

    const result = pois.map(p => {
      const translation = trans.find(t => t.MaPOI.toString() === p._id.toString());
      return {
        ...p,
        TenHienThi: translation?.TieuDe || p.TenPOI,
        MoTa: translation?.MoTa || '',
        Audios: translation?.Audios || [],
      };
    });

    return { data: result, total, page, limit };
  }

  // ── Find One POI ───────────────────────────────────────────────────
  async findOne(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid POI ID');
    }
    const poi = await this.poiModel.findById(id).lean();
    if (!poi) throw new NotFoundException('POI not found');

    const translations = await this.poiLangModel.find({ MaPOI: new Types.ObjectId(id) }).lean();

    return { ...poi, translations };
  }

  // ── Update POI ─────────────────────────────────────────────────────
  async update(id: string, dto: UpdatePoiDto): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid POI ID');
    }
    const { translations, ...poiData } = dto;

    const poi = await this.poiModel.findByIdAndUpdate(id, poiData, { new: true });
    if (!poi) throw new NotFoundException('POI not found');

    if (translations) {
      // Refresh translations: simple approach (Delete then Insert)
      await this.poiLangModel.deleteMany({ MaPOI: new Types.ObjectId(id) });
      const langEntries = translations.map(t => ({
        MaPOI_NgonNgu: t.MaPOI_NgonNgu,
        MaPOI: poi._id,
        MaNgonNgu: t.MaNgonNgu,
        TieuDe: t.TieuDe,
        MoTa: t.MoTa,
        Audios: t.Audios || [],
      }));
      await this.poiLangModel.insertMany(langEntries);
    }

    return this.findOne(id);
  }

  // ── Remove POI ─────────────────────────────────────────────────────
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid POI ID');
    }
    const poiId = new Types.ObjectId(id);
    const result = await this.poiModel.findByIdAndDelete(poiId);
    if (!result) throw new NotFoundException('POI not found');

    // Clean up translations
    await this.poiLangModel.deleteMany({ MaPOI: poiId });
  }
}

