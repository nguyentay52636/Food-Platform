import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'VI' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  maNgonNgu: string;

  @ApiProperty({ example: 'Tiếng Việt' })
  @IsString()
  @IsNotEmpty()
  tenNgonNgu: string;
}
