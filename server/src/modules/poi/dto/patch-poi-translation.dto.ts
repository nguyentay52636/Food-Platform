import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class PatchPoiTranslationDto {
  @ApiProperty({ description: 'ID ngôn ngữ cần thêm/cập nhật' })
  @IsMongoId()
  maNgonNgu: string;

  @ApiPropertyOptional({ description: 'Tiêu đề bản dịch (mặc định: tenPOI)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  tieuDe?: string;

  @ApiPropertyOptional({ description: 'Mô tả bản dịch' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  moTa?: string;

  @ApiPropertyOptional({ description: 'URL audio theo ngôn ngữ' })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'Thời lượng audio (giây)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  audioDurationSec?: number;
}
