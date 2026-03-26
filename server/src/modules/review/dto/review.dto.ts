// create-review.dto.ts
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '64abc123def456789012345' })
  @IsString()
  poiId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Nơi rất đẹp, âm thanh hướng dẫn rõ ràng!' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;

  @ApiPropertyOptional({ enum: ['vi', 'en', 'zh', 'ja'], default: 'vi' })
  @IsOptional()
  @IsEnum(['vi', 'en', 'zh', 'ja'])
  language?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  authorName?: string;

  @ApiPropertyOptional({ example: 'session-uuid-here' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ type: [String], example: ['https://...jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateReviewStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  @IsEnum(['pending', 'approved', 'rejected'])
  status: string;

  @ApiPropertyOptional({ example: 'Ngôn từ không phù hợp' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
