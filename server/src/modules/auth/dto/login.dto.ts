import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/schema/user.schema';

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

    @ApiProperty({ example: 'owner', enum: UserRole })
    role: string;

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