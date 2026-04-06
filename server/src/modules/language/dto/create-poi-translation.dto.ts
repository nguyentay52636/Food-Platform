import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePoiTranslationDto {
  @ApiProperty({ description: 'ID điểm POI', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  maPOI: string;

  @ApiProperty({ description: 'ID ngôn ngữ (bảng Tbl_NgonNgu)', example: '507f1f77bcf86cd799439012' })
  @IsMongoId()
  maNgonNgu: string;

  @ApiProperty({ example: 'Nhà hàng ABC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  tieuDe: string;

  @ApiPropertyOptional({ example: 'Mô tả ngắn...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  moTa?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/audio/poi-vi.mp3' })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @ApiPropertyOptional({ example: 123 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  audioDurationSec?: number;
}
