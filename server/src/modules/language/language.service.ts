import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language, LanguageDocument } from './schema/language.schema';
import { CreateLanguageDto } from './dto/create-language.dto';
import { MongoServerError } from 'mongodb';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDocument> {
    const { code } = createLanguageDto;
    
    const exists = await this.languageModel.findOne({ code: code.toLowerCase() }).lean();
    if (exists) {
      throw new ConflictException('Mã ngôn ngữ đã tồn tại');
    }

    try {
      const created = new this.languageModel(createLanguageDto);
      return await created.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException('Mã ngôn ngữ đã tồn tại');
      }
      throw err;
    }
  }

  async createMany(languages: CreateLanguageDto[]): Promise<any[]> {
    const results: any[] = [];
    for (const lang of languages) {
      try {
        const created = await this.create(lang);
        results.push({ code: lang.code, status: 'Created' });
      } catch (err) {
        results.push({ code: lang.code, status: err.message });
      }
    }
    return results;
  }

  async findAll(): Promise<LanguageDocument[]> {
    return this.languageModel.find().sort({ name: 1 }).exec();
  }

  async findOneByCode(code: string): Promise<LanguageDocument | null> {
    return this.languageModel.findOne({ code: code.toLowerCase() }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.languageModel.findByIdAndDelete(id).exec();
  }

  async clearAll(): Promise<void> {
    await this.languageModel.deleteMany({}).exec();
  }
}
