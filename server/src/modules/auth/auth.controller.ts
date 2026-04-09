import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterOwnerDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../user/schema/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Đăng ký tài khoản' })
    @ApiResponse({ status: 201, description: 'Đăng ký thành công.', type: RegisterResponseDto })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc username/email đã tồn tại.' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Đăng ký tài khoản với role mặc định là OWNER' })
    @ApiResponse({ status: 201, description: 'Đăng ký OWNER thành công.', type: RegisterResponseDto })
    @Post('register-owner')
    async registerOwner(@Body() registerDto: RegisterOwnerDto): Promise<RegisterResponseDto> {
        const fullDto: RegisterDto = {
            ...registerDto,
            role: UserRole.OWNER,
        };
        return this.authService.register(fullDto);
    }

    @ApiOperation({ summary: 'Đăng nhập hệ thống' })
    @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về access_token + thông tin user.', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Tài khoản hoặc mật khẩu không chính xác.' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }
}

