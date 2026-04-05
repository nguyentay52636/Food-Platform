// src/modules/review/review.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo review cho một POI' })
  create(@Body() dto: CreateReviewDto, @Request() req: any) {
    // Lấy IP từ request nếu có thể
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    return this.reviewService.create(dto, ipAddress);
  }

  @Get('poi/:poiId')
  @ApiOperation({ summary: 'Lấy danh sách review của một POI' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findByPOI(
    @Param('poiId') poiId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reviewService.findByPOI(poiId, +page, +limit);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Lấy tất cả reviews' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'isFlagged', required: false, type: Boolean })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('isFlagged') isFlagged?: string,
  ) {
    const query: any = {};
    if (isFlagged !== undefined) query.isFlagged = isFlagged === 'true';
    return this.reviewService.findAll(+page, +limit, query);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái review (flagged/deleted)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReviewStatusDto,
  ) {
    return this.reviewService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Xóa mềm review' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
