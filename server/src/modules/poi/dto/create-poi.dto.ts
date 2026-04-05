import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreatePoiDto {
    @ApiProperty({ description: 'Name of the POI' })
    @IsString()
    @IsNotEmpty()
    tenPOI: string;

    @ApiProperty({ description: 'Type of the POI' })
    @IsString()
    @IsNotEmpty()
    loaiPOI: string;

    @ApiProperty({ description: 'Language ID of the POI' })
    @IsString()
    @IsNotEmpty()
    NgonNguPOI: string;

    @ApiProperty({ description: 'Latitude coordinate' })
    @IsNumber()
    latitude: number;

    @ApiProperty({ description: 'Longitude coordinate' })
    @IsNumber()
    longitude: number;

    @ApiPropertyOptional({ description: 'Range trigger for notifications/actions' })
    @IsNumber()
    @IsOptional()
    rangeTrigger?: number;

    @ApiPropertyOptional({ description: 'URL to the thumbnail image' })
    @IsString()
    @IsOptional()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'Creation date' })
    @IsDateString()
    @IsOptional()
    ngayTao?: Date;

    @ApiPropertyOptional({ type: [String], description: 'List of image URLs' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @ApiPropertyOptional({ description: 'Physical address of the POI' })
    @IsString()
    @IsOptional()
    address?: string;
}
