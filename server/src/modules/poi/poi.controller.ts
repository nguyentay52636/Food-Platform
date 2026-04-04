// poi.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PoiService } from './poi.service';
import { CreatePoiDto, UpdatePoiDto } from './dto/poi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('POI Management')
@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo POI mới kèm các bản dịch ngôn ngữ' })
  create(@Body() createPoiDto: CreatePoiDto) {
    return this.poiService.create(createPoiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách POI với thông tin dịch ngôn ngữ (TieuDe, MoTa)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'lang', required: false, example: 'vi', description: 'Mã ngôn ngữ để lấy thông tin dịch thuật' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('lang') lang = 'vi',
  ) {
    return this.poiService.findAll(+page, +limit, lang);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết POI và tất cả các bản dịch ngôn ngữ hiện có' })
  findOne(@Param('id') id: string) {
    return this.poiService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật POI và các bản dịch ngôn ngữ kèm theo' })
  update(@Param('id') id: string, @Body() updatePoiDto: UpdatePoiDto) {
    return this.poiService.update(id, updatePoiDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa POI và tất cả các bản dịch liên quan' })
  remove(@Param('id') id: string) {
    return this.poiService.remove(id);
  }
}
