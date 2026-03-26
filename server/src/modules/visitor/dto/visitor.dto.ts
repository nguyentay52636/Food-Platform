// create-visitor-session.dto.ts
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVisitorSessionDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({ enum: ['direct', 'qr_code', 'share_link'] })
  @IsOptional()
  @IsEnum(['direct', 'qr_code', 'share_link'])
  entrySource?: string;

  @ApiPropertyOptional({ example: 'poi-id-here' })
  @IsOptional()
  @IsString()
  entryTargetId?: string;

  @ApiPropertyOptional({ enum: ['vi', 'en', 'zh', 'ja'] })
  @IsOptional()
  @IsEnum(['vi', 'en', 'zh', 'ja'])
  language?: string;
}

export class TrackEventDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  sessionId: string;
}

export class TrackPageViewDto extends TrackEventDto {
  @ApiProperty({ example: 'poi_detail' })
  @IsString()
  page: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  params?: Record<string, unknown>;
}

export class TrackPOIEventDto extends TrackEventDto {
  @ApiProperty({ example: '64abc123...' })
  @IsString()
  poiId: string;

  @ApiProperty({ enum: ['view', 'audio_play', 'audio_complete', 'directions', 'share', 'favorite'] })
  @IsEnum(['view', 'audio_play', 'audio_complete', 'directions', 'share', 'favorite'])
  eventType: string;

  @ApiPropertyOptional({ enum: ['vi', 'en', 'zh', 'ja'] })
  @IsOptional()
  @IsEnum(['vi', 'en', 'zh', 'ja'])
  languageCode?: string;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  audioProgress?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  durationSeconds?: number;
}

export class TrackTourEventDto extends TrackEventDto {
  @ApiProperty({ example: '64def456...' })
  @IsString()
  tourId: string;

  @ApiProperty({ enum: ['view', 'start', 'complete', 'share'] })
  @IsEnum(['view', 'start', 'complete', 'share'])
  eventType: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  progressPercent?: number;
}

export class TrackQRScanDto extends TrackEventDto {
  @ApiProperty({ example: '64ghi789...' })
  @IsString()
  qrCodeId: string;
}

export class EndSessionDto extends TrackEventDto {
  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  totalDurationSeconds?: number;
}
