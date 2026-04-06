import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePoiTranslationDto {
  @ApiPropertyOptional({ description: 'Đổi ngôn ngữ (ID trong Tbl_NgonNgu)' })
  @IsOptional()
  @IsMongoId()
  maNgonNgu?: string;

  @ApiPropertyOptional({ example: 'Tiêu đề mới' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  tieuDe?: string;

  @ApiPropertyOptional({ example: 'Mô tả cập nhật' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  moTa?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/audio/poi-en.mp3' })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @ApiPropertyOptional({ example: 125 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  audioDurationSec?: number;
}
