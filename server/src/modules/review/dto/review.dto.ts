// src/modules/review/dto/review.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '64abc123def456789012345' })
  @IsString()
  maPOI: string;

  @ApiProperty({ example: 'session-uuid-here' })
  @IsString()
  maSession: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  soSao: number;

  @ApiPropertyOptional({ example: 'Nơi rất đẹp, âm thanh hướng dẫn rõ ràng!' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  noiDung?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tenNguoiDung?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'device-id-xxxx' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}

export class UpdateReviewStatusDto {
  @ApiProperty({ description: 'Flagged status' })
  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;

  @ApiProperty({ description: 'Deleted status' })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
