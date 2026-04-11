import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PoiTranslationService } from '../language/poi-translation.service';
import { PoiTranslationDocument } from '../language/schema/poi-translation.schema';
import { Poi, PoiDocument } from './schema/poi.schema';
import { CreatePoiDto } from './dto/create-poi.dto';
import { PatchPoiTranslationDto } from './dto/patch-poi-translation.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { LanguageService } from '../language/language.service';
import { TtsService } from '../../common/services/tts.service';

export type CreatePoiResult = PoiContentByLanguageResult;

export type PoiContentByLanguageResult = {
  _id: string;
  tenPOI: string;
  loaiPOI: string;
  latitude: number;
  longitude: number;
  rangeTrigger?: number;
  thumbnail?: string;
  ngayTao?: Date;
  images?: string[];
  maOwner?: string;
  poiNgonNgu?: {
    _id: string;
    maPOI: string;
    ngonNgu: {
      _id: string;
      tenNgonNgu?: string;
    };
    tieuDe: string;
    moTa?: string;
    usedFallback: boolean;
    audio: {
      _id: string;
      maPOI_NgonNgu: string;
      audioUrl?: string;
      thoiLuong?: number;
    };
  };
  reviews?: any[];
};

@Injectable()
export class PoiService {
  constructor(
    @InjectModel(Poi.name) private readonly poiModel: Model<PoiDocument>,
    private readonly poiTranslationService: PoiTranslationService,
    private readonly languageService: LanguageService,
    private readonly ttsService: TtsService,
  ) { }

  private async buildPoiResponse(
    poi: Record<string, unknown>,
    preferredLanguageId?: string,
  ): Promise<PoiContentByLanguageResult> {
    const poiId = String(poi._id);
    const requestedLanguageId = preferredLanguageId;

    let exact: PoiTranslationDocument | null = null;
    if (requestedLanguageId) {
      exact = await this.poiTranslationService.findByPoiAndLanguage(
        poiId,
        requestedLanguageId,
      );
    }

    let chosen: PoiTranslationDocument | null = exact;
    let usedFallback = false;

    if (!chosen) {
      // Pick the first available translation if no specific language was requested/found
      const allTranslations = await this.poiTranslationService.findAll(poiId);
      if (allTranslations.length > 0) {
        chosen = allTranslations[0];
        usedFallback = true;
      }
    }

    if (!chosen) {
      return {
        _id: poiId,
        tenPOI: String(poi.tenPOI),
        loaiPOI: String(poi.loaiPOI),
        latitude: Number(poi.latitude),
        longitude: Number(poi.longitude),
        rangeTrigger: poi.rangeTrigger as number | undefined,
        thumbnail: poi.thumbnail as string | undefined,
        ngayTao: poi.ngayTao as Date | undefined,
        images: poi.images as string[] | undefined,
        maOwner: poi.maOwner ? String(poi.maOwner) : undefined,
        reviews: poi.reviews as any[],
      };
    }

    const languageObj = chosen.maNgonNgu as unknown as Record<string, unknown>;
    const maPOIRaw = chosen.maPOI as unknown as
      | string
      | { _id?: unknown }
      | Record<string, unknown>;
    const maPOIValue =
      typeof maPOIRaw === 'object' && maPOIRaw !== null && '_id' in maPOIRaw
        ? String((maPOIRaw as { _id?: unknown })._id ?? poiId)
        : String(maPOIRaw ?? poiId);
    const tenNgonNgu = (languageObj?.tenNgonNgu ??
      languageObj?.TenNgonNgu) as string | undefined;

    return {
      _id: poiId,
      tenPOI: String(poi.tenPOI),
      loaiPOI: String(poi.loaiPOI),
      latitude: Number(poi.latitude),
      longitude: Number(poi.longitude),
      rangeTrigger: poi.rangeTrigger as number | undefined,
      thumbnail: poi.thumbnail as string | undefined,
      ngayTao: poi.ngayTao as Date | undefined,
      images: poi.images as string[] | undefined,
      maOwner: poi.maOwner ? String(poi.maOwner) : undefined,
      poiNgonNgu: {
        _id: String(chosen._id),
        maPOI: maPOIValue,
        ngonNgu: {
          _id: String(languageObj?._id ?? chosen.maNgonNgu),
          tenNgonNgu,
        },
        tieuDe: chosen.tieuDe,
        moTa: chosen.moTa,
        usedFallback,
        audio: {
          _id: String(chosen._id),
          maPOI_NgonNgu: String(chosen._id),
          audioUrl: chosen.audioUrl,
          thoiLuong: chosen.audioDurationSec,
        },
      },
      reviews: poi.reviews as any[],
    };
  }



  async findAll(maNgonNgu?: string): Promise<PoiContentByLanguageResult[]> {
    const rows = await this.poiModel
      .find()
      .lean<Record<string, unknown>[]>()
      .exec();
    const results: PoiContentByLanguageResult[] = [];
    for (const row of rows) {
      try {
        results.push(await this.buildPoiResponse(row, maNgonNgu));
      } catch {
        // Skip POIs that do not have any translation yet.
      }
    }
    return results;
  }

  async findOne(id: string, maNgonNgu?: string): Promise<PoiContentByLanguageResult> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    const poi = await this.poiModel.findById(id).populate('reviews').lean<Record<string, unknown>>().exec();
    if (!poi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return this.buildPoiResponse(poi, maNgonNgu);
  }

  async update(
    id: string,
    updatePoiDto: UpdatePoiDto,
    maNgonNgu?: string,
  ): Promise<PoiContentByLanguageResult> {
    const updatedPoi = await this.poiModel
      .findByIdAndUpdate(id, updatePoiDto, { new: true })
      .lean<Record<string, unknown>>()
      .exec();
    if (!updatedPoi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return this.buildPoiResponse(updatedPoi, maNgonNgu);
  }

  async remove(id: string): Promise<PoiDocument> {
    const deletedPoi = await this.poiModel.findByIdAndDelete(id).exec();
    if (!deletedPoi) {
      throw new NotFoundException(`POI with ID ${id} not found`);
    }
    return deletedPoi;
  }

  async findByLoai(loai: string): Promise<PoiDocument[]> {
    return this.poiModel.find({ loaiPOI: loai }).exec();
  }

  async findContentByLanguage(
    id: string,
    maNgonNgu: string,
  ): Promise<PoiContentByLanguageResult> {
    return this.findOne(id, maNgonNgu);
  }

  async patchTranslation(
    poiId: string,
    dto: PatchPoiTranslationDto,
  ): Promise<PoiContentByLanguageResult> {
    if (!Types.ObjectId.isValid(poiId)) {
      throw new BadRequestException('poiId không hợp lệ');
    }

    const poi = await this.poiModel.findById(poiId).lean<Record<string, unknown>>().exec();
    if (!poi) {
      throw new NotFoundException(`POI with ID ${poiId} not found`);
    }

    const existing = await this.poiTranslationService.findByPoiAndLanguage(
      poiId,
      dto.maNgonNgu,
    );

    if (existing) {
      await this.poiTranslationService.update(String(existing._id), {
        tieuDe: dto.tieuDe,
        moTa: dto.moTa,
        audioUrl: dto.audioUrl,
        audioDurationSec: dto.audioDurationSec,
      });
    } else {
      await this.poiTranslationService.create({
        maPOI: poiId,
        maNgonNgu: dto.maNgonNgu,
        tieuDe: dto.tieuDe ?? String(poi.tenPOI),
        moTa: dto.moTa,
        audioUrl: dto.audioUrl,
        audioDurationSec: dto.audioDurationSec,
      });
    }

    return this.findOne(poiId, dto.maNgonNgu);
  }
  async create(
    createPoiDto: CreatePoiDto,
    maNgonNgu?: string,
  ): Promise<CreatePoiResult> {
    try {
      const { tieuDe, moTa, ...poiData } = createPoiDto;

      const createdPoi = new this.poiModel(poiData);
      await createdPoi.save();

      const languages = await this.languageService.findAll();

      // Automatically create translations for all system languages
      for (const lang of languages) {
        const currentLangId = lang._id.toString();
        const textToSpeak = moTa || tieuDe || (poiData as any).tenPOI;
        const audioFilename = `${createdPoi._id}_${lang.code}.mp3`;

        const audioUrl = await this.ttsService.generateSpeech(
          textToSpeak,
          lang.code,
          audioFilename,
        );

        await this.poiTranslationService.create({
          maPOI: String(createdPoi._id),
          maNgonNgu: currentLangId,
          tieuDe: tieuDe || (poiData as any).tenPOI,
          moTa: moTa,
          audioUrl: audioUrl || undefined,
        });
      }

      return this.buildPoiResponse(
        createdPoi.toObject() as unknown as Record<string, unknown>,
        maNgonNgu,
      );
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Tên POI đã tồn tại, vui lòng chọn tên khác');
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestException('Dữ liệu không hợp lệ: ' + err.message);
      }
      throw err;
    }
  }
}