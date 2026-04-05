import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import { Language, LanguageDocument } from './schema/language.schema';
import { CreateLanguageDto } from './dto/create-language.dto';

export type LanguageListItem = {
  _id: Types.ObjectId;
  maNgonNgu: string;
  tenNgonNgu: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
export function filterSameMaNgonNgu(code: string) {
  const upper = code.toUpperCase();
  return {
    $expr: {
      $eq: [
        {
          $toUpper: {
            $trim: {
              input: {
                $ifNull: [{ $ifNull: ['$MaNgonNgu', '$maNgonNgu'] }, ''],
              },
            },
          },
        },
        upper,
      ],
    },
  };
}

function normalizeLanguageDoc(
  doc: Record<string, unknown>,
): LanguageListItem | null {
  const rawCode = doc.MaNgonNgu ?? doc.maNgonNgu;
  const rawName = doc.TenNgonNgu ?? doc.tenNgonNgu;
  const ma =
    typeof rawCode === 'string' ? rawCode.toUpperCase().trim() : '';
  const ten = typeof rawName === 'string' ? rawName.trim() : '';
  if (!ma || !ten) {
    return null;
  }
  if (!doc._id || !Types.ObjectId.isValid(String(doc._id))) {
    return null;
  }
  return {
    _id: doc._id as Types.ObjectId,
    maNgonNgu: ma,
    tenNgonNgu: ten,
    createdAt: doc.createdAt as Date | undefined,
    updatedAt: doc.updatedAt as Date | undefined,
    __v: doc.__v as number | undefined,
  };
}

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDocument> {
    const rawCode = createLanguageDto.maNgonNgu?.trim();
    const rawName = createLanguageDto.tenNgonNgu?.trim();
  
    if (!rawCode || !rawName) {
      throw new BadRequestException('maNgonNgu và tenNgonNgu là bắt buộc');
    }
  
    const code = rawCode.toUpperCase();
  
    const exists = await this.languageModel
      .findOne({
        $or: [{ MaNgonNgu: code }, { maNgonNgu: code }],
      })
      .lean();
  
    if (exists) {
      throw new ConflictException('Mã ngôn ngữ đã tồn tại');
    }
  
    try {
      const created = new this.languageModel({
        MaNgonNgu: code,
        TenNgonNgu: rawName,
        maNgonNgu: code,
        tenNgonNgu: rawName,
      });
  
      return await created.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException('Mã ngôn ngữ đã tồn tại');
      }
      throw err;
    }
  }
  async findAll(): Promise<LanguageListItem[]> {
    const lean = await this.languageModel.find().lean().exec();
    const items: LanguageListItem[] = [];
    for (const row of lean) {
      const n = normalizeLanguageDoc(row as unknown as Record<string, unknown>);
      if (n) {
        items.push(n);
      }
    }
    items.sort((a, b) =>
      a.tenNgonNgu.localeCompare(b.tenNgonNgu, 'vi', { sensitivity: 'base' }),
    );
    return items;
  }

  async findOneByCode(code: string): Promise<LanguageDocument | null> {
    return this.languageModel.findOne(filterSameMaNgonNgu(code)).exec();
  }

  async remove(id: string): Promise<void> {
    await this.languageModel.findByIdAndDelete(id).exec();
  }
}
