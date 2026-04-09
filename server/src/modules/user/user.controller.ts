import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto, UserCreateDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './schema/user.schema';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo tài khoản mới (Mặc định role là OWNER)' })
    @ApiResponse({
        status: 201,
        description: 'Tạo tài khoản thành công',
        type: UserResponseDto,
    })
    async create(@Body() createDto: UserCreateDto): Promise<UserResponseDto> {
        if (!createDto.role) {
            createDto.role = UserRole.OWNER;
        }
        return this.userService.create(createDto) as any;
    }

    @Get('admins')
    @ApiOperation({ summary: 'Lấy danh sách tất cả Admin' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async getAdmins(): Promise<any[]> {
        return this.userService.findByRole(UserRole.ADMIN);
    }

    @Get('owners')
    @ApiOperation({ summary: 'Lấy danh sách tất cả Owner' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async getOwners(): Promise<any[]> {
        return this.userService.findByRole(UserRole.OWNER);
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lấy toàn bộ danh sách user' })
    @ApiResponse({
        status: 200,
        description: 'Danh sách tất cả user (không bao gồm mật khẩu)',
        type: [UserResponseDto],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Token không hợp lệ hoặc thiếu' })
    async getAllUsers(): Promise<any[]> {
        return this.userService.findAll();
    }
}
