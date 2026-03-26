import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseTourDto {
  @ApiProperty({ example: '64a2f1b2c3d4e5f6a7b8c9d0' })
  _id: string;

  @ApiProperty({ example: 'tour-da-nang-noi-bat' })
  slug: string;

  @ApiPropertyOptional()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiPropertyOptional({ example: 120 })
  estimatedDurationMinutes?: number;

  @ApiPropertyOptional({ example: 5000 })
  distanceMeters?: number;

  @ApiPropertyOptional({ enum: ['easy', 'moderate', 'hard'] })
  difficulty?: string;

  @ApiProperty({ type: [Object] })
  translations: object[];

  @ApiProperty({ type: [Object] })
  stops: object[];

  @ApiProperty({ enum: ['draft', 'published', 'archived'] })
  status: string;

  @ApiProperty({ example: false })
  isFeatured: boolean;

  @ApiProperty({ example: 0 })
  displayOrder: number;

  @ApiProperty({ example: 0 })
  viewCount: number;

  @ApiProperty({ example: 0 })
  startCount: number;

  @ApiProperty({ example: 0 })
  completionCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
