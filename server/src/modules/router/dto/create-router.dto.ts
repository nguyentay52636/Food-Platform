import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RouterPoiDto {
    @ApiProperty({ example: '64a1b2c3d4e5f6a7b8c9d001' })
    @IsNotEmpty()
    @IsString()
    maPoi: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    thuTu: number;
}

export class CreateRouterDto {
    @ApiProperty({ example: 'Ẩm thực Vĩnh Khánh' })
    @IsNotEmpty()
    @IsString()
    tenRouter: string;

    @ApiProperty({ example: 'Khám phá các quán ăn ngon tại khu Vĩnh Khánh' })
    @IsOptional()
    @IsString()
    moTa?: string;

    @ApiProperty({ example: '2 tiếng' })
    @IsOptional()
    @IsString()
    thoiGianDuKien?: string;

    @ApiProperty({ example: 'https://example.com/thumb.jpg' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiProperty({ type: [RouterPoiDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RouterPoiDto)
    pois: RouterPoiDto[];
}
