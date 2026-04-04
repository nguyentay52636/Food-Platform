import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePoiTranslationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    language: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    openingHours?: string;
}

export class CreatePoiDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(100)
    priceLevel: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(24)
    durationHours: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    qrCode: string;

    @ApiProperty({ type: [CreatePoiTranslationDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePoiTranslationDto)
    translations: CreatePoiTranslationDto[];
}
