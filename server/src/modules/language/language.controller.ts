import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mới một ngôn ngữ' })
  @ApiResponse({ status: 200, description: 'Ngôn ngữ được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Mã ngôn ngữ đã tồn tại' })
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả ngôn ngữ' })
  @ApiResponse({ status: 200, description: 'Danh sách các ngôn ngữ' })
  async findAll() {
    return this.languageService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một ngôn ngữ theo ID' })
  @ApiResponse({ status: 200, description: 'Ngôn ngữ đã được xóa' })
  async remove(@Param('id') id: string) {
    return this.languageService.remove(id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed 20 ngôn ngữ phổ biến và xóa dữ liệu cũ' })
  async seed() {
    await this.languageService.clearAll();

    const languages: CreateLanguageDto[] = [
      { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
      { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
      { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
      { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
      { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
      { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
      { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
      { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
      { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
      { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
      { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
      { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
      { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
      { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
      { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
      { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
      { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
      { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
      { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
    ];

    return this.languageService.createMany(languages);
  }
}
