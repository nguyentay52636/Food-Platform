import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PoiTranslationSummaryDto {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    maNgonNgu: string;

    @ApiProperty()
    tieuDe: string;

    @ApiPropertyOptional()
    moTa?: string;

    @ApiPropertyOptional()
    audioUrl?: string;

    @ApiPropertyOptional()
    audioDurationSec?: number;
}

export class ResponsePoiDto {
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
    maOwner?: string;

    @ApiPropertyOptional()
    createdAt?: Date;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @ApiPropertyOptional({ type: [PoiTranslationSummaryDto] })
    translations?: PoiTranslationSummaryDto[];
}
