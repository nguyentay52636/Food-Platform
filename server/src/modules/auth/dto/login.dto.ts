import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Tên đăng nhập hoặc email', example: 'thanhdz123' })
    @IsNotEmpty()
    account: string;

    @ApiProperty({ description: 'Mật khẩu', example: 'password123' })
    @IsNotEmpty()
    password: string;
}

export class AuthUserDto {
    @ApiProperty({ example: '660d2f8e2a1b2c3d4e5f6789' })
    _id: string;

    @ApiProperty({ example: 'thanhdz123' })
    username: string;

    @ApiProperty({ example: 'thanhdz@example.com' })
    email: string;

    @ApiProperty({ example: 'guest', enum: ['guest', 'admin', 'staff'] })
    role: string;

    @ApiProperty({ example: 'active', enum: ['active', 'inactive'] })
    status: string;

    @ApiProperty({ example: '0987654321', nullable: true })
    phone: string | null;

    @ApiProperty({ example: null, nullable: true })
    avatar: string | null;

    @ApiProperty({ example: '2026-03-25T08:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2026-03-25T08:00:00.000Z' })
    updatedAt: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;

    @ApiProperty({ type: () => AuthUserDto })
    user: AuthUserDto;
}