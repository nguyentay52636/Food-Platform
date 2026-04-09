import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schema/user.schema';

export class UserResponseDto {
    @ApiProperty({ example: '64a1b2c3d4e5f6a7b8c9d0e1', description: 'MongoDB ObjectId' })
    _id: string;

    @ApiProperty({ example: 'john_doe', description: 'Tên đăng nhập' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email' })
    email: string;

    @ApiProperty({ example: 'owner', enum: UserRole, description: 'Vai trò' })
    role: string;
}

export class UserCreateDto {
    @ApiProperty({ example: 'john_doe', description: 'Tên đăng nhập' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'owner', enum: UserRole, description: 'Vai trò', required: false })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
