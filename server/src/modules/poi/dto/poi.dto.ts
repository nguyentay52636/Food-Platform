// poi.dto.ts
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tbl_Audio
 */
export class AudioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  MaAudio?: number;

  @ApiProperty({ example: 'https://example.com/audio.mp3' })
  @IsString()
  AudioUrl: string;

  @ApiProperty({ example: 120, description: 'Duration in seconds' })
  @IsNumber()
  ThoiLuong: number;
}

/**
 * Tbl_POI_NgonNgu
 */
export class POITranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  MaPOI_NgonNgu?: number;

  @ApiProperty({ example: 'vi' })
  @IsString()
  MaNgonNgu: string;

  @ApiProperty({ example: 'Văn Miếu - Quốc Tử Giám' })
  @IsString()
  TieuDe: string;

  @ApiPropertyOptional({ example: 'Di tích lịch sử quan trọng của Việt Nam.' })
  @IsOptional()
  @IsString()
  MoTa?: string;

  @ApiPropertyOptional({ type: [AudioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudioDto)
  Audios?: AudioDto[];
}

/**
 * Tbl_POI
 */
export class CreatePoiDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  MaPOI?: number;

  @ApiProperty({ example: 'Văn Miếu' })
  @IsString()
  TenPOI: string;

  @ApiProperty({ example: 'Di tích' })
  @IsString()
  LoaiPOI: string;

  @ApiProperty({ example: 21.0285 })
  @IsNumber()
  Latitude: number;

  @ApiProperty({ example: 105.8542 })
  @IsNumber()
  Longitude: number;

  @ApiPropertyOptional({ example: 50, description: 'Trigger range in meters' })
  @IsOptional()
  @IsNumber()
  RangeTrigger?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Thumbnail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  NgayTao?: string;

  @ApiPropertyOptional({ type: [POITranslationDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => POITranslationDto)
  translations?: POITranslationDto[];

  @ApiPropertyOptional({ type: [Number], description: 'List of Category IDs' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  MaCategory?: number[];
}

export class UpdatePoiDto extends CreatePoiDto { }

/**
 * Other related entities based on the design
 */

export class CategoryDto {
  @ApiProperty()
  @IsNumber()
  MaCategory: number;

  @ApiProperty()
  @IsString()
  TenCategory: string;
}

export class RouteDto {
  @ApiProperty()
  @IsNumber()
  MaRoute: number;

  @ApiProperty()
  @IsString()
  TenRoute: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  MoTa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  ThoiGianDuKien?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Ordered list of POI IDs' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  POIs?: number[];
}

export class SessionDto {
  @ApiProperty({ example: 'uuid-string' })
  @IsString()
  MaSession: string;

  @ApiProperty()
  @IsDateString()
  ThoiDiemBatDau: string;
}

export class UserActivityDto {
  @ApiProperty()
  @IsNumber()
  MaActivity: number;

  @ApiProperty()
  @IsString()
  MaSession: string;

  @ApiProperty()
  @IsNumber()
  MaPOI: number;

  @ApiProperty({ example: 'view' })
  @IsString()
  HanhDong: string;

  @ApiProperty()
  @IsDateString()
  ThoiGian: string;
}

export class ReviewDto {
  @ApiProperty()
  @IsNumber()
  MaReview: number;

  @ApiProperty()
  @IsNumber()
  MaPOI: number;

  @ApiProperty()
  @IsString()
  MaSession: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  DeviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  IpAddress?: string;

  @ApiProperty()
  @IsString()
  TenNguoiDung: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Email?: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  SoSao: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  NoiDung?: string;

  @ApiProperty()
  @IsDateString()
  ThoiGian: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  isFlagged: boolean;
}