import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PoiTranslationService } from './poi-translation.service';
import { CreatePoiTranslationDto } from './dto/create-poi-translation.dto';
import { UpdatePoiTranslationDto } from './dto/update-poi-translation.dto';

@ApiTags('poi-translations')
@Controller('poi-translations')
export class PoiTranslationController {
  constructor(
    private readonly poiTranslationService: PoiTranslationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm bản dịch tiêu đề/mô tả POI theo ngôn ngữ' })
  @ApiResponse({ status: 201, description: 'Đã tạo' })
  @ApiResponse({ status: 409, description: 'Trùng cặp POI + ngôn ngữ' })
  async create(@Body() dto: CreatePoiTranslationDto) {
    return this.poiTranslationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách bản dịch POI (lọc theo POI nếu có maPOI)' })
  @ApiQuery({
    name: 'maPOI',
    required: false,
    description: 'Chỉ lấy bản dịch của một POI',
  })
  @ApiResponse({ status: 200, description: 'Danh sách' })
  async findAll(@Query('maPOI') maPOI?: string) {
    return this.poiTranslationService.findAll(maPOI);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một bản dịch theo ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  async findOne(@Param('id') id: string) {
    return this.poiTranslationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa bản dịch (tiêu đề, mô tả, hoặc đổi ngôn ngữ)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  @ApiResponse({ status: 409, description: 'Xung đột ngôn ngữ' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePoiTranslationDto,
  ) {
    return this.poiTranslationService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa một bản dịch' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Đã xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  async remove(@Param('id') id: string) {
    await this.poiTranslationService.remove(id);
  }
}
