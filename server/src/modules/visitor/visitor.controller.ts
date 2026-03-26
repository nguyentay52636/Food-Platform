// visitor.controller.ts
import { Body, Controller, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import {
  CreateVisitorSessionDto,
  TrackPageViewDto,
  TrackPOIEventDto,
  TrackTourEventDto,
  TrackQRScanDto,
  EndSessionDto,
} from './dto/visitor.dto';

@ApiTags('Visitor Tracking')
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @Post('session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo hoặc tiếp tục visitor session' })
  createOrResumeSession(
    @Body() dto: CreateVisitorSessionDto,
    @Req() req: Request & { ip: string; headers: Record<string, string> },
  ) {
    return this.visitorService.createOrResumeSession(dto, req);
  }

  @Post('track/page-view')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track lượt xem trang' })
  trackPageView(@Body() dto: TrackPageViewDto) {
    return this.visitorService.trackPageView(dto);
  }

  @Post('track/poi-event')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track sự kiện POI (view, audio, directions...)' })
  trackPOIEvent(@Body() dto: TrackPOIEventDto) {
    return this.visitorService.trackPOIEvent(dto);
  }

  @Post('track/tour-event')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track sự kiện Tour (view, start, complete...)' })
  trackTourEvent(@Body() dto: TrackTourEventDto) {
    return this.visitorService.trackTourEvent(dto);
  }

  @Post('track/qr-scan')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track lượt quét QR Code' })
  trackQRScan(@Body() dto: TrackQRScanDto) {
    return this.visitorService.trackQRScan(dto);
  }

  @Post('session/end')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kết thúc visitor session' })
  endSession(@Body() dto: EndSessionDto) {
    return this.visitorService.endSession(dto);
  }
}
