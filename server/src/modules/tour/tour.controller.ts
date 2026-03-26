import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ResponseTourDto } from './dto/response-tour.dto';

@ApiTags('Tours')
@ApiBearerAuth()
@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  // ─── POST /tours ───────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Tạo mới một Tour' })
  @ApiResponse({ status: 201, description: 'Tour đã được tạo', type: ResponseTourDto })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại' })
  async create(@Body() dto: CreateTourDto) {
    return this.tourService.create(dto);
  }

  // ─── GET /tours ────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả Tours' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'published', 'archived'],
    description: 'Lọc theo trạng thái',
  })
  @ApiResponse({ status: 200, description: 'Danh sách tours', type: [ResponseTourDto] })
  async findAll(@Query('status') status?: string) {
    return this.tourService.findAll(status);
  }

  // ─── GET /tours/:id ────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin Tour theo ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của Tour' })
  @ApiResponse({ status: 200, description: 'Tour tìm thấy', type: ResponseTourDto })
  @ApiResponse({ status: 404, description: 'Tour không tồn tại' })
  async findById(@Param('id') id: string) {
    return this.tourService.findById(id);
  }

  // ─── GET /tours/slug/:slug ─────────────────────────────────────────────────

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin Tour theo Slug' })
  @ApiParam({ name: 'slug', description: 'Slug URL-friendly của Tour', example: 'tour-da-nang-noi-bat' })
  @ApiResponse({ status: 200, description: 'Tour tìm thấy', type: ResponseTourDto })
  @ApiResponse({ status: 404, description: 'Tour không tồn tại' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tourService.findBySlug(slug);
  }

  // ─── PUT /tours/:id ────────────────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin Tour theo ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của Tour' })
  @ApiResponse({ status: 200, description: 'Tour đã được cập nhật', type: ResponseTourDto })
  @ApiResponse({ status: 404, description: 'Tour không tồn tại' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại' })
  async update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.tourService.update(id, dto);
  }

  // ─── DELETE /tours/:id ─────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa Tour theo ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của Tour' })
  @ApiResponse({ status: 204, description: 'Tour đã được xóa' })
  @ApiResponse({ status: 404, description: 'Tour không tồn tại' })
  async remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
