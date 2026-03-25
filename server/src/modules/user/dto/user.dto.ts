import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserResponseDto {
    @ApiProperty({ example: '64a1b2c3d4e5f6a7b8c9d0e1', description: 'MongoDB ObjectId' })
    _id?: string;

    @ApiProperty({ example: 'john_doe', description: 'Tên đăng nhập' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email' })
    email: string;

    @ApiProperty({ example: 'guest', enum: ['guest', 'admin', 'staff'], description: 'Vai trò' })
    role: string;

    @ApiProperty({ example: 'active', enum: ['active', 'inactive'], description: 'Trạng thái tài khoản' })
    status: string;

    @ApiProperty({ example: '0901234567', description: 'Số điện thoại', nullable: true })
    phone: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL ảnh đại diện', nullable: true })
    avatar: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Ngày tạo' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Ngày cập nhật' })
    updatedAt: Date;
}
export class userCreateDto {
    @ApiProperty({ example: '', description: 'Tên đăng nhập' })
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: '', description: 'Email' })
    @IsNotEmpty()
    email: string;
    @ApiProperty({ example: 'guest', enum: ['guest', 'admin', 'staff'], description: 'Vai trò' })
    @IsNotEmpty()
    role: string;
    @ApiProperty({ example: 'active', enum: ['active', 'inactive'], description: 'Trạng thái tài khoản' })
    @IsNotEmpty()
    status: string;
    @ApiProperty({ example: '0901234567', description: 'Số điện thoại', nullable: true })
    @IsOptional()
    phone: string;
    @ApiProperty({ example: '', description: 'URL ảnh đại diện', nullable: true })
    @IsOptional()
    avatar: string;
}
