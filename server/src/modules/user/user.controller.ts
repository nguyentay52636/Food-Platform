import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

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
