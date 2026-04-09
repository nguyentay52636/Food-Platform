import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginResponseDto } from './login.dto';
import { UserRole } from '../../user/schema/user.schema';

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

    @ApiProperty({ description: 'Vai trò', enum: UserRole, example: 'owner', required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}

export class RegisterOwnerDto {
    @ApiProperty({ description: 'Tên đăng nhập', example: 'thanhdz123' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Địa chỉ email', example: 'thanhdz@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Mật khẩu (ít nhất 6 ký tự)', example: 'password123' })
    @MinLength(6)
    password: string;
}

export class RegisterResponseDto extends LoginResponseDto { }