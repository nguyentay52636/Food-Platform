import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TourTranslationDto {
  @ApiProperty({ enum: ['vi', 'en', 'zh', 'ja'], example: 'vi' })
  @IsEnum(['vi', 'en', 'zh', 'ja'])
  languageCode: string;

  @ApiProperty({ example: 'Tour Đà Nẵng nổi bật' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Khám phá những điểm đến hấp dẫn nhất Đà Nẵng.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], example: ['Cầu Rồng', 'Bà Nà Hills'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];
}

export class TourStopDto {
  @ApiProperty({ example: '64a2f1b2c3d4e5f6a7b8c9d0' })
  @IsMongoId()
  poiId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  displayOrder: number;

  @ApiPropertyOptional({
    type: Object,
    example: { vi: 'Dừng 20 phút', en: '20 min stop' },
  })
  @IsOptional()
  notes?: Record<string, string>;
}

export class CreateTourDto {
  @ApiProperty({ example: 'tour-da-nang-noi-bat' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String], example: ['https://example.com/1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  estimatedDurationMinutes?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  distanceMeters?: number;

  @ApiPropertyOptional({ enum: ['easy', 'moderate', 'hard'], example: 'easy' })
  @IsOptional()
  @IsEnum(['easy', 'moderate', 'hard'])
  difficulty?: string;

  @ApiPropertyOptional({ type: [TourTranslationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourTranslationDto)
  translations?: TourTranslationDto[];

  @ApiPropertyOptional({ type: [TourStopDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourStopDto)
  stops?: TourStopDto[];

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
