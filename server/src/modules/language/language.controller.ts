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
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mới một ngôn ngữ' })
  @ApiResponse({ status: 200, description: 'Ngôn ngữ được tạo hoặc cập nhật thành công' })
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
  @ApiOperation({ summary: 'Seed dữ liệu ngôn ngữ phổ biến' })
  async seed() {
    const languages = [
      { maNgonNgu: 'VI', tenNgonNgu: 'Tiếng Việt' },
      { maNgonNgu: 'EN', tenNgonNgu: 'English' },
      { maNgonNgu: 'ZH', tenNgonNgu: 'Chinese (简体中文)' },
      { maNgonNgu: 'KO', tenNgonNgu: 'Korean (한국어)' },
      { maNgonNgu: 'JA', tenNgonNgu: 'Japanese (日本語)' },
      { maNgonNgu: 'DE', tenNgonNgu: 'German (Deutsch)' },
      { maNgonNgu: 'FR', tenNgonNgu: 'French (Français)' }
    ];
    
    const results: any[] = [];
    for (const lang of languages) {
      try {
        const res = await this.languageService.create(lang);
        results.push({ maNgonNgu: lang.maNgonNgu, status: 'Created' });
      } catch (err) {
        results.push({ maNgonNgu: lang.maNgonNgu, status: 'Exists or Failed' });
      }
    }
    return results;
  }
}
