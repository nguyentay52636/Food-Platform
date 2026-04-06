import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PoiNgonNguAudioDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  maPOI_NgonNgu: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiPropertyOptional()
  thoiLuong?: number;
}

class PoiNgonNguLanguageDto {
  @ApiProperty()
  _id: string;

  @ApiPropertyOptional()
  tenNgonNgu?: string;
}

class PoiNgonNguDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  maPOI: string;

  @ApiProperty({ type: PoiNgonNguLanguageDto })
  ngonNgu: PoiNgonNguLanguageDto;

  @ApiProperty()
  tieuDe: string;

  @ApiPropertyOptional()
  moTa?: string;

  @ApiProperty()
  usedFallback: boolean;

  @ApiProperty({ type: PoiNgonNguAudioDto })
  audio: PoiNgonNguAudioDto;
}

export class PoiContentResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  tenPOI: string;

  @ApiProperty()
  loaiPOI: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiPropertyOptional()
  rangeTrigger?: number;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional()
  ngayTao?: Date;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiPropertyOptional()
  address?: string;

  @ApiProperty({ type: PoiNgonNguDto })
  poiNgonNgu: PoiNgonNguDto;
}
