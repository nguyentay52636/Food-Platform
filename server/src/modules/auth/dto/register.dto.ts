import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginResponseDto } from './login.dto';

export class RegisterDto {
    @ApiProperty({ description: 'Tên đăng nhập', example: 'thanhdz123' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Địa chỉ email', example: 'thanhdz@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Mật khẩu (ít nhất 6 ký tự)', example: 'password123' })
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ description: 'Số điện thoại', example: '0987654321' })
    @IsOptional()
    phone?: string;
}

// Response đăng ký có cùng cấu trúc với login (token + user)
export class RegisterResponseDto extends LoginResponseDto {}