import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'vi' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Vietnamese' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Tiếng Việt' })
  @IsString()
  @IsNotEmpty()
  nativeName: string;

  @ApiProperty({ example: '🇻🇳' })
  @IsString()
  @IsNotEmpty()
  flag: string;
}
